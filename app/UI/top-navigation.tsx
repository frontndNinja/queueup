"use client";
import { useState } from 'react';
import SignOutButton from './form-elements/signout-button';
import { UserCircle2 } from "lucide-react";
import { User } from '@/app/definitions/definitions';
import Image from 'next/image';
import Button from './base/button';
import { useRouter } from 'next/navigation';
import ClickAwayListener from 'react-click-away-listener';



export default function TopNavigation({ user }: { user: User | null; }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();
    const handleClickAway = () => {
        setIsProfileOpen(false);
    };
    return (
        <div className="flex items-center justify-between h-[70px] px-14 fixed top-0 left-0 right-0 z-50 bg-lighter-background">
            <div className="w-fit">

                <Button text="Home" icon="HomeIcon" goTo={'/'} />
            </div>
            <div className="flex items-center gap-6 relative">
                {user && (

                    <div className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 rounded-md p-2 hover:text-primary text-gray-500" onClick={() => setIsProfileOpen(!isProfileOpen)} >
                        {user.name && (
                            <p className="text-sm ">{user.name.substring(0, user.name.indexOf(" ")) ?? ""}</p>
                        )}
                        {user.image && (
                            <Image src={user.image} alt={user.name ?? ""} width={22} height={22} className="rounded-full object-cover aspect-square" />
                        )}
                        {!user.image && (
                            <UserCircle2 className="w-[22px] h-[22px]" />
                        )}
                    </div>
                )}

                <>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <nav className={`${isProfileOpen ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-[-1]"} absolute top-13 right-0 w-[150px] rounded-b-md shadow-md p-2 pt-4 bg-lighter-background transition-all duration-300`} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <div className="flex flex-col justify-start items-start gap-4">
                                <Button text="Dashboard" icon="LayoutDashboardIcon" goTo={'/dashboard'} />
                                {user && (
                                    <div className="flex items-center justify-end group hover:bg-primary/10 rounded-md p-2 w-full cursor-pointer" onClick={() => router.push('/profile')}>
                                        <SignOutButton colorIcon="group-hover:text-primary" colorText="group-hover:text-white" />
                                    </div>
                                )}
                            </div>
                        </nav>
                    </ClickAwayListener>
                </>


                {!user && (
                    <Button text="Login" icon="LogInIcon" goTo={'/api/auth/signin'} />
                )}
            </div>
        </div>
    );
}