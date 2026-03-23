"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
export default function LogoutButton() {
    return (
        <LogOut onClick={() => signOut({ callbackUrl: "/api/auth/logout" })} />
    );
}