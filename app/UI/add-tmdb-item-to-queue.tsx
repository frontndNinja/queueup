"use client";

import Button from "./base/button";
import { EntryWithRelationsAndVotes } from "@/app/definitions/definitions";
import { createEntry } from "@/actions/entries";
import { useState, useEffect } from "react";
import { useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { buildNewItemFieldsFromFormData, validateNewItemFields } from "./form-elements/add-item-form-helpers";

export default function AddTMDBItemToQueue({ item, alreadyInQueue, onAdded }: { item: EntryWithRelationsAndVotes; alreadyInQueue?: boolean; onAdded?: (tmdbId: number) => void; }) {
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const queueId = params.queueId as string;
    const router = useRouter();
    const [addedNow, setAddedNow] = useState(false);
    const isAdded = !!alreadyInQueue || addedNow;

    async function handleAddItem(item: EntryWithRelationsAndVotes) {
        if (isAdded) return;

        setError(null);

        const fd = new FormData();
        fd.append("title", item.title);
        fd.append("description", item.description ?? "");
        fd.append("type", item.type);
        fd.append("status", item.status);
        fd.append("priority", item.priority);
        fd.append("releaseYear", item.releaseYear?.toString() ?? "");
        fd.append("releaseDate", item.releaseDate?.toString() ?? "");
        fd.append("runtimeMinutes", item.runtimeMinutes?.toString() ?? "");
        fd.append("whereToWatch", item.whereToWatch ?? "");
        fd.append("notes", item.notes ?? "");
        fd.append("tags", item.tags.join(","));
        fd.append("source", item.source);
        fd.append("tmdbId", item.tmdbId?.toString() ?? "");
        fd.append("imdbId", item.imdbId ?? "");
        fd.append("posterUrl", item.posterUrl ?? "");
        fd.append("posterUrlThumbnail", item.posterUrlThumbnail ?? "");
        const payload = buildNewItemFieldsFromFormData(fd);

        const validationError = validateNewItemFields(payload);

        if (validationError) {
            setError(validationError);
            return;
        }

        startTransition(async () => {
            const result = await createEntry(queueId, payload);
            if (result.ok) {
                setAddedNow(true);
                if (item.tmdbId != null) onAdded?.(item.tmdbId);
                router.refresh();
                return;
            }
            setError(result.error);
        });
    };

    return (
        <>
            {error ? (
                <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                </p>
            ) : null}
            <div className="flex items-center gap-2 mb-2">
                <Button icon="PlusIcon" text={isAdded ? "Added to queue" : pending ? "Saving…" : "Add to queue"} action={() => { handleAddItem(item); }} disabled={pending || isAdded} />
            </div>
        </>
    );
}