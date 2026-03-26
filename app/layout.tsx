import { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

import { ReactNode } from "react";
import { requireUser } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import TopNavigation from "@/app/UI/top-navigation";
import { User } from "@/app/definitions/definitions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getMyPendingInvites } from "@/actions/invites";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    template: '%s | QueueUp',
    default: 'Queue Up',
  },
  description: 'Find out what you should watch',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  const invites = await getMyPendingInvites();
  const hasInvites = invites.length;
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-background text-foreground">
        <main className="max-w-[1440px] mx-auto pt-[70px]">
          <TopNavigation user={sessionUser as User} invites={hasInvites} />
          <div className="max-w-[900px] mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}


