"use client";

import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
    Edit2Icon,
    LogOutIcon,
    UserIcon,
    User2Icon,
    LogInIcon,
    PlusIcon,
    HomeIcon,
    LayoutDashboardIcon,
} from "lucide-react";

type IconName =
    | "Edit2Icon"
    | "LogOutIcon"
    | "UserIcon"
    | "User2Icon"
    | "LogInIcon"
    | "PlusIcon"
    | "HomeIcon"
    | "LayoutDashboardIcon";

const iconMap: Record<IconName, LucideIcon> = {
    Edit2Icon,
    LogOutIcon,
    UserIcon,
    User2Icon,
    LogInIcon,
    PlusIcon,
    HomeIcon,
    LayoutDashboardIcon,
};

export default function Button({
    text,
    action,
    goTo,
    icon,
}: {
    text: string;
    action?: () => void;
    goTo?: string;
    icon?: IconName;
}) {
    const router = useRouter();
    const IconComponent = icon ? iconMap[icon] : null;

    const handleClick = () => {
        if (goTo) {
            router.push(goTo);
            return;
        }
        action?.();
    };

    return (
        <Link href={goTo ?? ""}
            onClick={handleClick}
            className="flex items-center justify-end group gap-3 hover:bg-primary/10 rounded-md p-2 w-full cursor-pointer"
        >
            <p className="text-sm text-gray-500 group-hover:text-white">{text}</p>
            {IconComponent ? (
                <IconComponent className="w-[16px] h-[16px] group-hover:text-primary" />
            ) : null}
        </Link>
    );
}