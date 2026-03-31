"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/UI/base/button";
import { deleteEntry } from "@/actions/entries";

export default function DeleteEntryButton({
    entryId,
    queueId,
}: {
    entryId: string;
    queueId: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    return (
        <div className="relative ml-3 rounded-full hover:border border-primary/50 hover:bg-primary/10 w-[30px] h-[30px] flex items-center justify-center">
            <Button
                text={pending ? "Deleting..." : "Delete"}
                type="icon"
                icon="TrashIcon"
                disabled={pending}
                action={() =>
                    startTransition(async () => {
                        await deleteEntry(entryId, queueId);
                        router.refresh();
                    })
                }
            />
        </div>
    );
}