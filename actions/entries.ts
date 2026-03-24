"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUser } from "./users";
import type { NewItemFields } from "@/app/definitions/definitions";
import type { VoteValue } from "@prisma/client";

export async function getQueueEntries(queueId: string) {
    const user = await getUser();
    if (!user) return [];

    // Ensure user is member (or owner) of this queue
    const allowed = await prisma.queue.findFirst({
        where: {
            id: queueId,
            OR: [
                { ownerId: user.id },
                { members: { some: { userId: user.id } } },
            ],
        },
        select: { id: true },
    });

    if (!allowed) return [];

    return prisma.entry.findMany({
        where: { queueId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            type: true,
            status: true,
            priority: true,
            posterUrl: true,
            posterUrlThumbnail: true,
            createdAt: true,
            addedByUserId: true,
        },
    });
}

export async function getEntryById(entryId: string) {
    const user = await getUser();
    if (!user) return null;

    return prisma.entry.findFirst({
        where: {
            id: entryId,
            queue: {
                OR: [
                    { ownerId: user.id },
                    { members: { some: { userId: user.id } } },
                ],
            },
        },
        include: {
            votes: true,
            queue: { select: { id: true, name: true } },
        },
    });
}

export type CreateEntryResult =
    | { ok: true; }
    | { ok: false; error: string; };

export async function createEntry(
    queueId: string,
    data: NewItemFields,
): Promise<CreateEntryResult> {
    const user = await getUser();
    if (!user) return { ok: false, error: "You must be signed in." };

    const allowed = await prisma.queue.findFirst({
        where: {
            id: queueId,
            OR: [
                { ownerId: user.id },
                { members: { some: { userId: user.id } } },
            ],
        },
        select: { id: true },
    });
    if (!allowed) {
        return { ok: false, error: "Queue not found or access denied." };
    }

    const title = data.title.trim();
    if (!title) {
        return { ok: false, error: "Title is required." };
    }

    await prisma.entry.create({
        data: {
            queueId,
            addedByUserId: user.id,
            title,
            description: data.description?.trim() || null,
            type: data.type,
            status: data.status,
            priority: data.priority,
            releaseYear: data.releaseYear,
            runtimeMinutes: data.runtimeMinutes,
            whereToWatch: data.whereToWatch?.trim() || null,
            notes: data.notes?.trim() || null,
            tags: data.tags,
            source: data.source,
            tmdbId: data.tmdbId,
            imdbId: data.imdbId?.trim() || null,
            posterUrl: data.posterUrl?.trim() || null,
            posterUrlThumbnail: data.posterUrlThumbnail?.trim() || null,
        },
    });

    revalidatePath(`/dashboard/queue/${queueId}`);
    return { ok: true };
}


const VOTE_VALUES: VoteValue[] = ["LIKE", "SUPERLIKE", "DISLIKE"];

function parseVoteValue(v: string): VoteValue | null {
    return VOTE_VALUES.includes(v as VoteValue) ? (v as VoteValue) : null;
}

export async function updateVote(entryId: string, vote: string) {
    const user = await getUser();
    if (!user) return null;

    const nextValue = parseVoteValue(vote);
    if (!nextValue) return null;

    const entry = await prisma.entry.findFirst({
        where: {
            id: entryId,
            queue: {
                OR: [
                    { ownerId: user.id },
                    { members: { some: { userId: user.id } } },
                ],
            },
        },
        select: { id: true },
    });
    if (!entry) return null;

    return prisma.entryVote.upsert({
        where: {
            entryId_userId: {
                entryId: entry.id,
                userId: user.id,
            },
        },
        create: {
            entryId: entry.id,
            userId: user.id,
            value: nextValue,
        },
        update: {
            value: nextValue,
        },
    });
}