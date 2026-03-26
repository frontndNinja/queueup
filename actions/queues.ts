"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./users";
import { User } from "@/app/definitions/definitions";
import { calcVoteScore } from "@/lib/votes";
import { revalidatePath } from "next/cache";


export async function getMemberQueues() {
    const user = await getUser() as User;
    if (!user) return null;

    const queueIds = user?.memberships;
    if (!queueIds) return [];

    const ids = user.memberships.map((membership) => membership.queueId) as string[];;

    const queues = await prisma.queue.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        include: {
            entries: true,
        },
    });
    return queues;
}

//TODO
export async function getOwnedQueues() {
    const user = await getUser() as User;
    if (!user) return null;

    const queueIds = user?.queueIds;
    if (!queueIds) return [];
    const queues = await prisma.queue.findMany({
        where: {
            id: {
                in: queueIds,
            },
        },
        include: {
            entries: true,
        },
    });
    return queues;
}

export async function getQueueById(queueId: string) {
    const user = (await getUser()) as User;
    if (!user) return null;
    // Optional but recommended: enforce membership/ownership like your other queries
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
    if (!allowed) return null;
    const queues = await prisma.queue.findMany({
        where: { id: queueId },
        include: {
            entries: {
                include: {
                    votes: { select: { value: true } },
                },
            },
        },
    });
    const priorityRank: Record<"HIGH" | "MEDIUM" | "LOW", number> = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2,
    };

    return queues.map((q) => {
        const entriesWithScore = q.entries.map((e) => ({
            ...e,
            voteScore: calcVoteScore(e.votes),
        }));
        entriesWithScore.sort((a, b) => {
            /* const prio = priorityRank[a.priority] - priorityRank[b.priority];
            if (prio !== 0) return prio; */
            const score = b.voteScore - a.voteScore;
            if (score !== 0) return score;
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return { ...q, entries: entriesWithScore };
    });
}

export async function createQueueWithMembers(input: {
    name: string;
    description?: string;
    memberIds: string[];
}) {
    const user = (await getUser()) as User | null;
    if (!user) {
        return { ok: false as const, error: "You must be signed in." };
    }

    const name = input.name.trim();
    if (!name) {
        return { ok: false as const, error: "Queue name is required." };
    }

    // Treat memberIds as invitees, dedupe, and never invite yourself
    const inviteeIds = Array.from(new Set(input.memberIds)).filter((id) => id !== user.id,);

    const queue = await prisma.queue.create({
        data: {
            name,
            description: input.description?.trim() || null,
            ownerId: user.id,
            members: {
                createMany: {
                    data: [{
                        userId: user.id,
                        role: "OWNER",
                    }],
                    skipDuplicates: true,
                },
            },
            invites: {
                createMany: {
                    data: inviteeIds.map((invitedUserId) => ({
                        invitedUserId: invitedUserId,
                        invitedById: user.id,
                    })),
                    skipDuplicates: true,
                },
            },
        },
        select: { id: true },
    });

    revalidatePath("/dashboard");
    return { ok: true as const, queueId: queue.id };
}


export async function updateQueueDetails(queueId: string, { name, description }: { name: string, description?: string | null; }) {
    const user = await getUser();
    if (!user) return null;

    const queue = await prisma.queue.findUnique({
        where: { id: queueId },
        select: { ownerId: true },
    });
    if (!queue) return null;
    const isOwner = queue.ownerId === user.id;
    const isMember = await prisma.queueMember.findUnique({
        where: { queueId_userId: { queueId, userId: user.id } },
        select: { userId: true },
    });
    if (!isOwner && !isMember) return null;

    if (name.trim() === "") return null;

    await prisma.queue.update({
        where: { id: queueId },
        data: { name: name.trim(), description: description?.trim() || null },
    });

    revalidatePath("/dashboard/queue/" + queueId);
    revalidatePath("/dashboard/");
    return { ok: true as const, queueId: queueId };
}

export async function removeMember(queueId: string, memberUserId: string) {
    const user = await getUser();
    if (!user) return null;

    const queueItem = await prisma.queue.findUnique({ where: { id: queueId }, select: { ownerId: true } });

    if (!queueItem) return null;
    if (queueItem.ownerId !== user.id) return null;

    const memberToRemove = await prisma.queueMember.findUnique({
        where: { queueId_userId: { queueId: queueId, userId: memberUserId } },
    });
    if (!memberToRemove) return null;
    if (memberToRemove.role === "OWNER") return null;

    await prisma.queueMember.delete({
        where: { queueId_userId: { queueId: queueId, userId: memberUserId } },
    });

    revalidatePath("/dashboard/queue/" + queueId);
    return { ok: true as const, queueId: queueId };
}

export async function leaveQueue(queueId: string) {
    const user = await getUser();
    if (!user) return null;

    const memberToLeave = await prisma.queueMember.findUnique({
        where: { queueId_userId: { queueId, userId: user.id } },
    });
    if (!memberToLeave) return null;

    if (!memberToLeave) return null;
    if (memberToLeave.role === "OWNER") return null;

    await prisma.queueMember.delete({
        where: { queueId_userId: { queueId: queueId, userId: user.id } },
    });

    revalidatePath("/dashboard/queue/" + queueId);
    revalidatePath("/dashboard/");
    return { ok: true as const, queueId: queueId };
}

export async function inviteMembers(queueId: string, userIds: string[]) {
    const user = await getUser();
    if (!user) return null;

    const queueItem = await prisma.queue.findUnique({ where: { id: queueId } });
    if (!queueItem) return null;

    const isUserMember = await prisma.queueMember.findUnique({
        where: {
            queueId_userId: {
                queueId: queueId,
                userId: user.id
            }
        },
    });

    const isUserOwner = queueItem.ownerId === user.id;
    if (!isUserMember && !isUserOwner) return null;

    const candidateIds = Array.from(new Set(userIds)).filter((id) => id !== user.id && id !== queueItem.ownerId);
    if (candidateIds.length === 0) {
        return { ok: true as const, queueId };
    }

    // filter out users already in queue
    const existingMembers = await prisma.queueMember.findMany({
        where: {
            queueId,
            userId: { in: candidateIds },
        },
        select: { userId: true },
    });

    const existingMemberIds = new Set(existingMembers.map((m) => m.userId));
    const inviteeIds = candidateIds.filter((id) => !existingMemberIds.has(id));

    if (inviteeIds.length === 0) {
        return { ok: true as const, queueId };
    }

    await prisma.queueInvite.createMany({
        data: inviteeIds.map((invitedUserId) => ({
            queueId,
            invitedUserId,
            invitedById: user.id,
        })),
        skipDuplicates: true,
    });

    revalidatePath("/dashboard/queue/" + queueId);
    revalidatePath("/dashboard");
    return { ok: true as const, queueId: queueId };
}

export async function deleteQueue(queueId: string) {
    const user = await getUser();
    if (!user) return null;

    const queueItem = await prisma.queue.findUnique({ where: { id: queueId }, select: { ownerId: true } });
    if (!queueItem) return null;
    if (queueItem.ownerId !== user.id) return null;

    await prisma.queue.delete({ where: { id: queueId } });
    revalidatePath("/dashboard");
    return { ok: true as const, queueId: queueId };
}
