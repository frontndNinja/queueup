import { ReactNode } from "react";
import { requireUser } from '@/lib/permissions';
import { redirect } from 'next/navigation';
export default async function DashboardLayout({ children }: { children: ReactNode; }) {

    /* AUTHENTICATION */
    const user = await requireUser().catch(() => null);
    if (user?.userId === '') {
        redirect('/login');
    }

    return (
        <>
            {children}
        </>
    );
}