import NextAuth, { DefaultSession } from "next-auth";

/* declare module "next-auth" {
    interface Session {
        user?: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
    }
} */


declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string;
        };
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
    }
}