export type IconName =
    | "Edit2Icon"
    | "LogOutIcon"
    | "UserIcon"
    | "User2Icon"
    | "LogInIcon"
    | "PlusIcon"
    | "HomeIcon"
    | "LayoutDashboardIcon"
    | "ThumbsUpIcon"
    | "ThumbsDownIcon"
    | "CrownIcon"
    | "CircleChevronUpIcon"
    | "CircleChevronDownIcon"
    | "CircleMinusIcon"
    | "MonitorCheckIcon"
    | "MonitorDownIcon"
    | "OctagonXIcon"
    | "CirclePlusIcon";


export type PillIconName =
    | "FilmIcon"
    | "TvMinimalPlayIcon"
    | "CircleChevronUpIcon"
    | "CircleChevronDownIcon"
    | "CircleMinusIcon"
    | "CheckIcon"
    | "OctagonXIcon"
    | "ClockCheckIcon"
    | "StarIcon"
    | "CalendarCheck2Icon"
    | "EllipsisVerticalIcon";


export type Priority = "medium" | "high" | "low";


export interface QuickActionOption {
    id: string;
    text: string;
    value?: "SUPERLIKE" | "LIKE" | "DISLIKE" | "PLANNED" | "WATCHED" | "SKIPPED" | "LOW" | "MEDIUM" | "HIGH";
    icon: IconName;
}

export interface QuickAction {
    title: string;
    options: QuickActionOption[];
}