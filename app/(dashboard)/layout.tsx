import { ReactNode } from "react";
import { requireUser } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import TopNavigation from "../UI/top-navigation";
import { User } from "../definitions/definitions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
export default async function DashboardLayout({ children }: { children: ReactNode; }) {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    /* AUTHENTICATION */
    const user = await requireUser().catch(() => null);
    if (user?.userId === '') {
        redirect('/api/auth/signin');
    }

    return (
        <>
            {/*     {sessionUser && (
                <TopNavigation user={sessionUser as User} />
            )} */}
            {children}
        </>
    );
}