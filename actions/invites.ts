"use server";
import { prisma } from "@/lib/prisma";
import { getUser } from "./users";
import { revalidatePath } from "next/cache";
import { getQueueById } from "./queues";

export async function acceptInvite(inviteId: string) {
    const user = await getUser();
    if (!user) return null;

    return prisma.$transaction(async (tx) => {
        const invite = await tx.queueInvite.findUnique({
            where: { id: inviteId },
        });

        if (!invite) return null;
        if (invite.status !== "PENDING") return null;

        // Security: only the invited user can accept
        if (invite.invitedUserId !== user.id) return null;

        await tx.queueInvite.update({
            where: { id: inviteId },
            data: {
                status: "ACCEPTED",
                respondedAt: new Date(),
            },
        });

        // This is what makes the queue appear in "my queues"
        await tx.queueMember.create({
            data: {
                queueId: invite.queueId,
                userId: user.id,
                role: "MEMBER",
            },
        });

        return invite;
    });
}

export async function declineInvite(inviteId: string) {
    const invite = await prisma.queueInvite.findUnique({
        where: { id: inviteId },
    });
    if (!invite) return [];
    if (invite.status !== "PENDING") return [];

    await prisma.queueInvite.update({
        where: { id: inviteId },
        data: {
            status: "DECLINED",
            respondedAt: new Date(),
        },
    });
    return invite;
}

//Use as Notifications and as a list of invites to accept or decline
export async function getMyPendingInvites() {
    const user = await getUser();
    if (!user) return [];

    const invites = await prisma.queueInvite.findMany({
        where: { invitedUserId: user.id, status: "PENDING" },
        include: {
            queue: { select: { id: true, name: true, description: true } },
            invitedBy: { select: { id: true, name: true, email: true } },
        },
    });
    return invites;
}
