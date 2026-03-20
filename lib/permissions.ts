/* //requireQueueMember/Owner helpersimport { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
export async function requireUser() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) throw new Error("UNAUTHENTICATED");
    return { userId, session };
}

export async function requireQueueMember(queueId: string) {
    const { userId } = await requireUser();

    const queue = await prisma.queue.findUnique({
        where: { id: queueId },
        select: { id: true, ownerId: true },
    });
    if (!queue) throw new Error("NOT_FOUND");

    if (queue.ownerId === userId) return { userId, role: "OWNER" as const };

    const member = await prisma.queueMember.findUnique({
        where: { queueId_userId: { queueId, userId } },
        select: { role: true },
    });
    if (!member) throw new Error("FORBIDDEN");

    return { userId, role: member.role };
}

export async function requireQueueOwner(queueId: string) {
    const { userId } = await requireUser();
    const queue = await prisma.queue.findUnique({
        where: { id: queueId },
        select: { ownerId: true },
    });
    if (!queue) throw new Error("NOT_FOUND");
    if (queue.ownerId !== userId) throw new Error("FORBIDDEN");
    return { userId };
}
 */


import { getServerSession } from "next-auth/next";
import type { QueueRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RequiredUser = {
    userId: string;
    email: string | null;
};

export async function requireUser(): Promise<RequiredUser> {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; email?: string | null; } | undefined;
    const userId = user?.id;

    /*   if (!userId) {
          throw new Error("UNAUTHENTICATED");
      } */
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