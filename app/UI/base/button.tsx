"use client";

import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { IconName } from "@/app/definitions/small-definitions";

import {
    Edit2Icon,
    LogOutIcon,
    UserIcon,
    User2Icon,
    LogInIcon,
    PlusIcon,
    HomeIcon,
    LayoutDashboardIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
    CrownIcon,
    CircleChevronUpIcon,
    CircleChevronDownIcon,
    CircleMinusIcon,
    MonitorCheckIcon,
    MonitorDownIcon,
    OctagonXIcon,
    CirclePlusIcon
} from "lucide-react";

const iconMap: Record<IconName, LucideIcon> = {
    Edit2Icon,
    LogOutIcon,
    UserIcon,
    User2Icon,
    LogInIcon,
    PlusIcon,
    HomeIcon,
    LayoutDashboardIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
    CrownIcon,
    CircleChevronUpIcon,
    CircleChevronDownIcon,
    CircleMinusIcon,
    MonitorCheckIcon,
    MonitorDownIcon,
    OctagonXIcon,
    CirclePlusIcon
};

export default function Button({
    text,
    action,
    goTo,
    icon,
    type,
}: {
    text?: string;
    action?: () => void;
    goTo?: string;
    icon?: IconName;
    type?: "button" | "icon";
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

    const content = (
        <>
            {text && type !== "icon" && <p className="text-sm text-gray-500 group-hover:text-white">{text}</p>}
            {IconComponent ? (
                <IconComponent className="w-[16px] h-[16px] group-hover:text-primary" />) : null}
        </>
    );

    return (
        goTo ? <Link href={goTo ?? ""}
            onClick={handleClick}
            className={`flex items-center justify-end group gap-3 hover:bg-primary/10 rounded-md p-2 w-full cursor-pointer ${type === "icon" ? "w-fit" : "w-full"}`}
            title={text}
        >
            {content}
        </Link>
            :
            <button onClick={handleClick} className={`flex items-center justify-end group gap-3 hover:bg-primary/10 rounded-md p-2 w-full cursor-pointer ${type === "icon" ? "w-fit" : "w-full"}`}
                title={text}
            >
                {content}
            </button>
    );
}