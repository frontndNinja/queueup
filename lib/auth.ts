import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) (token as any).userId = user.id;
            return token;
        },
        async session({ session, token }) {
            if (session.user) (session.user as any).id = (token as any).userId;
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url === "/api/auth/logout" || url.startsWith("/?signedOut=1")) {
                return `${baseUrl}/`;
            }
            if (url === "/" || url === baseUrl || url === `${baseUrl}/`) {
                return `${baseUrl}/dashboard`;
            }
            return `${baseUrl}/dashboard`;
        },
    },
};