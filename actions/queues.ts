import { prisma } from "@/lib/prisma";
import { getUser } from "./users";
import { User } from "@/app/definitions/definitions";
import { calcVoteScore } from "@/lib/votes";


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