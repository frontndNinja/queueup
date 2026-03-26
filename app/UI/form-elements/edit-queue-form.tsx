"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    updateQueueDetails,
    inviteMembers,
    removeMember,
    leaveQueue,
    deleteQueue,
} from "@/actions/queues";
import QueueFormFields, { type QueueCandidate } from "./queue-form-fields";

type Member = {
    userId: string;
    role: "OWNER" | "MEMBER";
    name: string | null;
    email: string | null;
};

type PendingInvite = {
    id: string;
    invitedUserId: string;
    name: string | null;
    email: string | null;
};

export default function EditQueueForm({
    queueId,
    initialName,
    initialDescription,
    isOwner,
    currentUserId,
    candidates,
    members,
    pendingInvites,
}: {
    queueId: string;
    initialName: string;
    initialDescription: string;
    isOwner: boolean;
    currentUserId: string;
    candidates: QueueCandidate[];
    members: Member[];
    pendingInvites: PendingInvite[];
}) {
    const router = useRouter();

    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
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

        const detailResult = await updateQueueDetails(queueId, {
            name: trimmedName,
            description: description || null,
        });

        if (!detailResult?.ok) {
            setSaving(false);
            setError("Could not update queue details.");
            return;
        }

        if (selectedIds.length > 0) {
            const inviteResult = await inviteMembers(queueId, selectedIds);
            if (!inviteResult?.ok) {
                setSaving(false);
                setError("Could not send invites.");
                return;
            }
        }

        setSaving(false);
        setSelectedIds([]);
        setQuery("");
        router.refresh();
    };

    return (
        <div className="flex flex-col gap-6">
            <QueueFormFields
                mode="edit"
                name={name}
                description={description}
                query={query}
                selectedIds={selectedIds}
                candidates={candidates}
                saving={saving}
                error={error}
                submitLabel="Save changes"
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

            <div className="flex flex-col gap-3">
                <h2 className="text-sm-h2">Members</h2>
                {members.map((m) => (
                    <div
                        key={m.userId}
                        className="flex items-center justify-between rounded-md border border-border p-2"
                    >
                        <div>
                            <div className="text-sm">{m.name ?? "Unnamed user"}</div>
                            <div className="text-xs text-muted-foreground">
                                {m.email ?? "No email"} - {m.role}
                            </div>
                        </div>

                        {isOwner && m.role !== "OWNER" ? (
                            <button
                                type="button"
                                disabled={saving}
                                onClick={async () => {
                                    setSaving(true);
                                    const result = await removeMember(queueId, m.userId);
                                    setSaving(false);
                                    if (!result?.ok) {
                                        setError("Could not remove member.");
                                        return;
                                    }
                                    router.refresh();
                                }}
                                className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted disabled:opacity-60"
                            >
                                Remove
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-sm-h2">Pending invites</h2>
                {pendingInvites.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No pending invites.</p>
                ) : (
                    pendingInvites.map((i) => (
                        <div
                            key={i.id}
                            className="rounded-md border border-border p-2 text-sm text-muted-foreground"
                        >
                            {i.name ?? "Unnamed user"} ({i.email ?? "No email"})
                        </div>
                    ))
                )}
            </div>

            {!isOwner ? (
                <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                        setSaving(true);
                        const result = await leaveQueue(queueId);
                        setSaving(false);
                        if (!result?.ok) {
                            setError("Could not leave queue.");
                            return;
                        }
                        router.push("/dashboard");
                        router.refresh();
                    }}
                    className="w-fit rounded-md border border-red-400 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                >
                    Leave queue
                </button>
            ) : null}
            {isOwner ? (
                <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                        setSaving(true);
                        const result = await deleteQueue(queueId);
                        setSaving(false);
                        if (!result?.ok) {
                            setError("Could not delete queue.");
                            return;
                        }
                        router.push("/dashboard");
                        router.refresh();
                    }}
                    className="w-fit rounded-md border border-red-400 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                >
                    Delete queue
                </button>
            ) : null}
        </div>
    );
}