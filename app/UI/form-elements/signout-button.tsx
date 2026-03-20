"use client";
import { signOut } from "next-auth/react";
export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/api/auth/logout" })}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Log out
        </button>
    );
}