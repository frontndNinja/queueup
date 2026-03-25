import {
    FilmIcon,
    TvMinimalPlayIcon,
    CircleChevronUpIcon,
    CircleChevronDownIcon,
    CircleMinusIcon,
    CheckIcon,
    OctagonXIcon,
    ClockCheckIcon,
    StarIcon,
    CalendarCheck2Icon,
    EllipsisVerticalIcon
} from "lucide-react";
import type { PillIconName } from "@/app/definitions/small-definitions";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<PillIconName, LucideIcon> = {
    FilmIcon,
    TvMinimalPlayIcon,
    CircleChevronUpIcon,
    CircleChevronDownIcon,
    CircleMinusIcon,
    CheckIcon,
    OctagonXIcon,
    ClockCheckIcon,
    StarIcon,
    CalendarCheck2Icon,
    EllipsisVerticalIcon
};

export default function Pill({ text, color, icon, type }: { text: string; color?: string; icon?: PillIconName; type?: string; }) {
    const IconComponent = icon ? iconMap[icon] : null;

    return (
        <div className={`flex items-center justify-end group gap-2 rounded-md w-fit ${type === "underline" ? "px-4 py-2" : "px-2.5 py-1"} ${color === "gray" ? "bg-lighter-background" : color === "blue" ? "bg-pill-blue/10" : color === "green" ? "bg-pill-green/10" : color === "red" ? "bg-pill-red/10" : "bg-primary/10"}`} title={text}>
            {IconComponent ? (
                <IconComponent className={`w-[16px] h-[16px] ${color === "gray" ? "text-gray-400" : color === "blue" ? "text-pill-blue" : color === "green" ? "text-pill-green" : color === "red" ? "text-pill-red" : "text-primary"}`} />
            ) : null}
            <p className={`${type === "underline" ? "text-gray-400 text-sm-p4" : "text-white text-sm"}`}>{text}</p>
        </div>
    );
}