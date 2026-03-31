import type { QuickAction } from "@/app/definitions/small-definitions";

const voteOptions: QuickAction = {
    title: "Vote",
    options: [
        { icon: "CrownIcon", text: "Superlike", id: crypto.randomUUID(), value: "SUPERLIKE" },
        { icon: "ThumbsUpIcon", text: "Like", id: crypto.randomUUID(), value: "LIKE" },
        { icon: "ThumbsDownIcon", text: "Dislike", id: crypto.randomUUID(), value: "DISLIKE" },
    ],
};

const priorityOptions: QuickAction = {
    title: "Priority",
    options: [
        { icon: "CircleChevronDownIcon", text: "Low", id: crypto.randomUUID(), value: "LOW" },
        { icon: "CircleMinusIcon", text: "Medium", id: crypto.randomUUID(), value: "MEDIUM" },
        { icon: "CircleChevronUpIcon", text: "High", id: crypto.randomUUID(), value: "HIGH" },
    ],
};

const statusOptions: QuickAction = {
    title: "Status",
    options: [
        { icon: "MonitorDownIcon", text: "Plan to watch", id: crypto.randomUUID(), value: "PLANNED" },
        { icon: "MonitorCheckIcon", text: "Watched", id: crypto.randomUUID(), value: "WATCHED" },
        { icon: "OctagonXIcon", text: "Skip", id: crypto.randomUUID(), value: "SKIPPED" },
    ],
};

export const allOptions: QuickAction[] = [voteOptions, priorityOptions, statusOptions];