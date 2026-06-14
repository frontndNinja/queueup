import type { QueueRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

type RequiredUser = {
    userId: string;
    email: string | null;
};

export async function requireUser(): Promise<RequiredUser> {
    const session = await getCurrentUser();
    const user = session as { id?: string; email?: string | null; } | undefined;
    const userId = user?.id;

    if (!userId) {
        return {
            userId: "" as string,
            email: null,
        };
    }

    return {
        userId,
        email: user?.email ?? null,
    };
}

export async function requireQueueMember(
    queueId: string
): Promise<RequiredUser & { role: QueueRole | "OWNER"; }> {
    const user = await requireUser();

    const queue = await prisma.queue.findUnique({
        where: { id: queueId },
        select: { ownerId: true },
    });

    if (!queue) {
        throw new Error("NOT_FOUND");
    }

    if (queue.ownerId === user.userId) {
        return { ...user, role: "OWNER" };
    }

    const member = await prisma.queueMember.findUnique({
        where: { queueId_userId: { queueId, userId: user.userId } },
        select: { role: true },
    });

    if (!member) {
        throw new Error("FORBIDDEN");
    }

    return { ...user, role: member.role };
}

export async function requireQueueOwner(
    queueId: string
): Promise<RequiredUser & { role: "OWNER"; }> {
    const user = await requireUser();

    const queue = await prisma.queue.findUnique({
        where: { id: queueId },
        select: { ownerId: true },
    });

    if (!queue) {
        throw new Error("NOT_FOUND");
    }

    if (queue.ownerId !== user.userId) {
        throw new Error("FORBIDDEN");
    }

    return { ...user, role: "OWNER" };
}