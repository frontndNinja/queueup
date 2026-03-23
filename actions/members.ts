"use server";

/* import { caching, revalidationTags } from "@/config/caching";
import { apiGetJwtBearer } from "./apiGetJwtBearer"; */
import { users } from "@/lib/dummyData";


export async function getMembers() {
    const members = users;
    //const members = await prisma.member.findMany();
    return members;
}