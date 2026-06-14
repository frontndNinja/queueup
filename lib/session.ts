import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return null;
    return prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, image: true, memberships: { select: { queueId: true } } } });
});