"use client";
import { useState } from 'react';
import SignOutButton from './form-elements/signout-button';
import { UserCircle2 } from "lucide-react";
import { User } from '@/app/definitions/definitions';
import Image from 'next/image';
import Link from 'next/link';
import Button from './base/button';



export default function TopNavigation({ user }: { user: User | null; }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="flex items-center justify-between">
            <Link href="/">Home</Link>
            <div className="flex items-center gap-2">
                {user && (
                    <>
                        <UserCircle2 onClick={() => setIsProfileOpen(!isProfileOpen)} />
                        <nav className={isProfileOpen ? "block" : "hidden"}>
                            <div className="flex items-center gap-2">
                                <Image src={user.image ?? ""} alt={user.name ?? ""} width={40} height={40} className="rounded-full object-cover aspect-square" />
                                <div>
                                    <p className="text-sm text-gray-500">{user.name ?? ""}</p>
                                    <p className="text-sm text-gray-500">{user.email ?? ""}</p>
                                </div>
                            </div>
                        </nav>
                        <SignOutButton />
                    </>
                )}
                {!user && (
                    <Button text="Login" goTo={'/api/auth/signin'} />
                )}
            </div>
        </div>
    );
}