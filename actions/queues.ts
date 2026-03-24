import { prisma } from "@/lib/prisma";
import { getUser } from "./users";
import { User } from "@/app/definitions/definitions";

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
    const user = await getUser() as User;
    if (!user) return null;

    const queues = await prisma.queue.findMany({
        where: {
            id: queueId,
        },
        include: {
            entries: true,
        },
    });
    return queues;
}
