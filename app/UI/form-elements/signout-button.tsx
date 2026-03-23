"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
export default function LogoutButton({ colorIcon, colorText }: { colorIcon?: string, colorText?: string; }) {
    return (
        <button className="flex items-center gap-3 cursor-pointer" onClick={() => signOut({ callbackUrl: "/api/auth/logout" })}>
            <p className={`text-sm text-gray-500 ${colorText}`}>Logout</p>
            <LogOut className={`w-[18px] h-[18px] ${colorIcon}`} onClick={() => signOut({ callbackUrl: "/api/auth/logout" })} />
        </button>
    );
}