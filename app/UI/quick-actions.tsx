"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import type { IconName, QuickAction } from "@/app/definitions/small-definitions";
import type { EntryWithRelationsAndVotes } from "@/app/definitions/definitions";
import { updateVote } from "@/actions/entries";
import { ActionButton } from "./action-buttons";

import ClickAwayListener from "react-click-away-listener";

import { updatePriority, updateStatus } from "@/actions/entries";

function toStatus(text: string): "PLANNED" | "WATCHED" | "SKIPPED" | null {
    if (text === "Plan to watch") return "PLANNED";
    if (text === "Watched") return "WATCHED";
    if (text === "Skip") return "SKIPPED";
    return null;
}

function toPriority(text: string): "LOW" | "MEDIUM" | "HIGH" | null {
    if (text === "Low") return "LOW";
    if (text === "Medium") return "MEDIUM";
    if (text === "High") return "HIGH";
    return null;
}

export default function QuickActions({
    allOptions,
    item,
    currentUserId,
}: {
    allOptions?: QuickAction[];
    item: EntryWithRelationsAndVotes;
    currentUserId: string;
}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const myVoteValue =
        item.votes.find((v) => v.userId === currentUserId)?.value ?? null;

    const handleClickAway = () => {
        setIsOpen(false);
    };

    return (
        <div className="flex items-center justify-center rounded-md w-fit relative" onMouseEnter={() => setIsOpen(true)}>
            <PencilIcon
                className="w-[16px] h-[16px] text-primary cursor-pointer hover:text-white"
                onClick={() => setIsOpen((v) => !v)} onMouseEnter={() => setIsOpen(true)}
            />
            <ClickAwayListener onClickAway={handleClickAway}>
                <div
                    className={`absolute top-[30px] right-[-10px] w-[200px] bg-secondary rounded-md shadow-md ${isOpen ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-[-1]"
                        }`}
                >
                    <div className="flex flex-col gap-4 justify-between items-end px-4 py-2">
                        {allOptions?.map((group) => (
                            <div key={group.title}>
                                <div className="flex gap-1 w-fit items-center">
                                    {group.title ? (
                                        <p className="text-sm-p4 font-normal mr-3">{group.title}</p>
                                    ) : null}

                                    {group.options.map((opt) => {
                                        const isVoteGroup = group.title === "Vote";
                                        const isPriorityGroup = group.title === "Priority";
                                        const isStatusGroup = group.title === "Status";

                                        const selected = isVoteGroup
                                            ? !!opt.value && opt.value === myVoteValue
                                            : isPriorityGroup
                                                ? item.priority === toPriority(opt.text)
                                                : isStatusGroup
                                                    ? item.status === toStatus(opt.text)
                                                    : false;

                                        return (
                                            <ActionButton
                                                key={opt.id}
                                                icon={opt.icon as IconName}
                                                type="icon"
                                                text={opt.text}
                                                selected={selected}
                                                onClick={async () => {
                                                    if (isVoteGroup) {
                                                        await updateVote(item.id, opt.value ?? "");
                                                        router.refresh();
                                                    }
                                                    if (isPriorityGroup) {
                                                        await updatePriority(item.id, opt.value ?? "");
                                                        router.refresh();
                                                    }
                                                    if (isStatusGroup) {
                                                        await updateStatus(item.id, opt.value ?? "");
                                                        router.refresh();
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ClickAwayListener>
        </div>
    );
}