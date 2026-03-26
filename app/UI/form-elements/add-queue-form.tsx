"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQueueWithMembers } from "@/actions/queues";
import QueueFormFields, { type QueueCandidate } from "./queue-form-fields";

export default function AddQueueForm({ candidates }: { candidates: QueueCandidate[]; }) {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [query, setQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmedName = name.trim();
        if (!trimmedName) {
            setError("Queue name is required.");
            return;
        }

        setSaving(true);
        const result = await createQueueWithMembers({
            name: trimmedName,
            description,
            memberIds: selectedIds,
        });
        setSaving(false);

        if (!result?.ok) {
            setError(result?.error ?? "Could not create queue.");
            return;
        }

        router.push(`/dashboard/queue/${result.queueId}`);
        router.refresh();
    };

    return (
        <QueueFormFields
            mode="add"
            name={name}
            description={description}
            query={query}
            selectedIds={selectedIds}
            candidates={candidates}
            saving={saving}
            error={error}
            submitLabel="Create queue"
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onQueryChange={setQuery}
            onAddMember={(id) => {
                setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
                setQuery("");
            }}
            onRemoveMember={(id) => {
                setSelectedIds((prev) => prev.filter((x) => x !== id));
            }}
            onSubmit={onSubmit}
        />
    );
}