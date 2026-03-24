
/* import { caching, revalidationTags } from "@/config/caching";
import { apiGetJwtBearer } from "./apiGetJwtBearer"; */
/* import { users } from "@/lib/dummyData";


export default async function getMembers() {
    const members = users;
    //const members = await prisma.member.findMany();
    return members;
} */

"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUser() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
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