"use client";

import type { LucideIcon } from "lucide-react";
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
    CirclePlusIcon,
    CheckIcon,
    XIcon,
    MailIcon,
    TicketPlusIcon
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
    CirclePlusIcon,
    CheckIcon,
    XIcon,
    MailIcon,
    TicketPlusIcon
};

export function ActionButton({
    text,
    icon,
    selected = false,
    onClick,
    type = "icon",
}: {
    text?: string;
    icon?: IconName;
    selected?: boolean;
    onClick?: () => void | Promise<void>;
    type?: "button" | "icon";
}) {
    const IconComponent = icon ? iconMap[icon] : null;

    return (
        <button
            type="button"
            onClick={() => void onClick?.()}
            className={`flex items-center justify-end group gap-3 rounded-md p-2 cursor-pointer ${selected ? "bg-primary/20" : "hover:bg-primary/10"
                } ${type === "icon" ? "w-fit" : "w-full"}`}
            title={text}
        >
            {text && type !== "icon" ? (
                <p
                    className={`text-sm ${selected ? "text-white" : "text-gray-500"
                        } group-hover:text-white`}
                >
                    {text}
                </p>
            ) : null}

            {IconComponent ? (
                <IconComponent
                    className={`w-[16px] h-[16px] ${selected ? "text-primary" : "group-hover:text-primary"
                        }`}
                />
            ) : null}
        </button>
    );
}