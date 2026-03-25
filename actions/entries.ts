"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUser } from "./users";
import type { NewItemFields } from "@/app/definitions/definitions";
import type { VoteValue, EntryPriority, EntryStatus } from "@prisma/client";
import { calcVoteScore } from "@/lib/votes";

/* ################################# */
/* ######### QUERY ENTRIES ######### */
/* ################################# */

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

/* ################################# */
/* ######### SINGLE ENTRY ########## */
/* ################################# */

export async function getEntryById(entryId: string) {
    const user = await getUser();
    if (!user) return null;

    const entry = await prisma.entry.findFirst({
        where: {
            id: entryId,
            queue: {
                OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
            },
        },
        include: {
            votes: true,
            queue: { select: { id: true, name: true } },
        },
    });

    if (!entry) return null;

    const voteScore = calcVoteScore(entry.votes);
    return { ...entry, voteScore };
}

export type CreateEntryResult =
    | { ok: true; }
    | { ok: false; error: string; };


/* ################################# */
/* ####### CREATE NEW ENTRY ######## */
/* ################################# */

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

/* ################################# */
/* ######### UPDATE VOTE ########### */
/* ################################# */

const VOTE_VALUES: VoteValue[] = ["LIKE", "SUPERLIKE", "DISLIKE"];

function parseVoteValue(v: string): VoteValue | null {
    return VOTE_VALUES.includes(v as VoteValue) ? (v as VoteValue) : null;
}

function voteWeight(v: VoteValue): number {
    if (v === "LIKE") return 1;
    if (v === "SUPERLIKE") return 3;
    return -1; // DISLIKE
}

export async function updateVote(entryId: string, vote: string) {
    const user = await getUser();
    if (!user) return null;

    const nextValue = parseVoteValue(vote);
    console.log("nextValue", nextValue);
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

    return prisma.$transaction(async (tx) => {
        const existing = await tx.entryVote.findUnique({
            where: {
                entryId_userId: {
                    entryId: entry.id,
                    userId: user.id,
                },
            },
            select: { value: true },
        });

        const oldWeight = existing ? voteWeight(existing.value) : 0;
        const newWeight = voteWeight(nextValue);
        const delta = newWeight - oldWeight;

        if (existing?.value === nextValue) {
            await tx.entryVote.delete({
                where: {
                    entryId_userId: {
                        entryId: entry.id,
                        userId: user.id,
                    },
                },
            });
            await tx.entry.update({
                where: { id: entry.id },
                data: { voteScore: { increment: -oldWeight } },
            });
            return { undone: true };
        }
        else {
            const voteRow = await tx.entryVote.upsert({
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

            await tx.entry.update({
                where: { id: entry.id },
                data: { voteScore: { increment: delta } },
            });

            return voteRow;
        }
    });
}

/* ################################# */
/* ######### UPDATE PRIORITY ####### */
/* ################################# */

const parsePriority = (v: string): EntryPriority | null => {
    if (v === "LOW") return "LOW";
    if (v === "MEDIUM") return "MEDIUM";
    if (v === "HIGH") return "HIGH";
    return null;
};
export async function updatePriority(entryId: string, priority: string) {
    const user = await getUser();
    if (!user) return null;

    const nextPriority = parsePriority(priority);
    if (!nextPriority) return null;

    // Optional but recommended: enforce access (owner/member) like you do elsewhere
    return prisma.entry.updateMany({
        where: {
            id: entryId,
            queue: {
                OR: [
                    { ownerId: user.id },
                    { members: { some: { userId: user.id } } },
                ],
            },
        },
        data: { priority: nextPriority },
    });
}

/* ################################# */
/* ######### UPDATE STATUS ######### */
/* ################################# */

const parseStatus = (v: string): EntryStatus | null => {
    if (v === "PLANNED") return "PLANNED";
    if (v === "WATCHED") return "WATCHED";
    if (v === "SKIPPED") return "SKIPPED";
    return null;
};
export async function updateStatus(entryId: string, status: string) {
    const user = await getUser();
    if (!user) return null;

    const nextStatus = parseStatus(status);
    if (!nextStatus) return null;

    // Optional but recommended: enforce access (owner/member) like you do elsewhere
    return prisma.entry.updateMany({
        where: {
            id: entryId,
            queue: {
                OR: [
                    { ownerId: user.id },
                    { members: { some: { userId: user.id } } },
                ],
            },
        },
        data: { status: nextStatus },
    });
}