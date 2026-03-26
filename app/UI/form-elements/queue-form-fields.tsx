"use client";

import { useMemo } from "react";

export type QueueCandidate = {
    id: string;
    name: string | null;
    email: string | null;
};

type Props = {
    mode: "add" | "edit";
    name: string;
    description: string;
    query: string;
    selectedIds: string[];
    candidates: QueueCandidate[];
    saving: boolean;
    error: string | null;
    submitLabel: string;

    onNameChange: (v: string) => void;
    onDescriptionChange: (v: string) => void;
    onQueryChange: (v: string) => void;
    onAddMember: (id: string) => void;
    onRemoveMember: (id: string) => void;
    onSubmit: (e: React.FormEvent) => void;
};

export default function QueueFormFields({
    mode,
    name,
    description,
    query,
    selectedIds,
    candidates,
    saving,
    error,
    submitLabel,
    onNameChange,
    onDescriptionChange,
    onQueryChange,
    onAddMember,
    onRemoveMember,
    onSubmit,
}: Props) {
    const selectedUsers = useMemo(
        () => candidates.filter((c) => selectedIds.includes(c.id)),
        [candidates, selectedIds],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return candidates.filter((c) => !selectedIds.includes(c.id));

        return candidates.filter((c) => {
            if (selectedIds.includes(c.id)) return false;
            const n = (c.name ?? "").toLowerCase();
            const e = (c.email ?? "").toLowerCase();
            return n.includes(q) || e.includes(q);
        });
    }, [candidates, query, selectedIds]);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
                <label htmlFor="queue-name" className="block text-sm mb-1">
                    Queue name
                </label>
                <input
                    id="queue-name"
                    required
                    minLength={1}
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="w-full rounded-md border border-border bg-background p-2"
                    placeholder="Movie Night"
                />
            </div>

            <div>
                <label htmlFor="queue-description" className="block text-sm mb-1">
                    Description
                </label>
                <textarea
                    id="queue-description"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="w-full rounded-md border border-border bg-background p-2"
                    placeholder="What is this queue for?"
                    rows={3}
                />
            </div>

            <div className="relative">
                <label htmlFor="invite-search" className="block text-sm mb-1">
                    {mode === "add" ? "Invite members" : "Invite more members"}
                </label>
                <input
                    id="invite-search"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className="w-full rounded-md border border-border bg-background p-2"
                    placeholder="Search by name or email"
                />

                {query.trim().length > 0 && filtered.length > 0 ? (
                    <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-card shadow-lg">
                        {filtered.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => onAddMember(c.id)}
                                className="block w-full px-3 py-2 text-left hover:bg-primary/10"
                            >
                                <div className="text-sm">{c.name ?? "Unnamed user"}</div>
                                <div className="text-xs text-muted-foreground">
                                    {c.email ?? "No email"}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            {selectedUsers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((u) => (
                        <span
                            key={u.id}
                            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm"
                        >
                            {u.name ?? u.email ?? u.id}
                            <button
                                type="button"
                                onClick={() => onRemoveMember(u.id)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                x
                            </button>
                        </span>
                    ))}
                </div>
            ) : null}

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
                type="submit"
                disabled={saving}
                className="w-fit rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60"
            >
                {saving ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}