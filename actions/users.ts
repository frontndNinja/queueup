"use server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function getUser() {
    const session = await getCurrentUser();
    const userId = session?.id;
    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            memberships: { select: { queueId: true } },
        },
    });

    if (!user) return null;

    return {
        ...user,
        queueIds: user.memberships.map((m) => m.queueId),
    };
}

export async function getSpecificUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
        },
    });

    if (!user) return null;

    return user;
}
//TODO: Needed??
export async function getAllUsers() {
    const members = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            memberships: {
                select: { queueId: true },
            },
        },
    });

    // keep your existing UI shape: user.queueIds
    return members.map((u) => ({
        ...u,
        queueIds: u.memberships.map((m) => m.queueId),
    }));
}