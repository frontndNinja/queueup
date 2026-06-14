import { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

import TopNavigation from "@/app/UI/top-navigation";
import { User } from "@/app/definitions/definitions";
import { getCurrentUser } from "@/lib/session";

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

  const sessionUser = await getCurrentUser();
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-background text-foreground">
        <main className="max-w-[1440px] mx-auto pt-[70px]">
          <TopNavigation user={sessionUser as User} />
          <div className="max-w-[900px] mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}


