"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createEntry } from "@/actions/entries";
import type { NewItemFields } from "@/app/definitions/definitions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const inputClass =
    "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function parseTags(raw: string): string[] {
    return raw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}

function parseIntOrNull(raw: string): number | null {
    const t = raw.trim();
    if (!t) return null;
    const n = parseInt(t, 10);
    return Number.isFinite(n) ? n : null;
}

function validatePayload(p: NewItemFields): string | null {
    const title = p.title.trim();
    if (!title) return "Title is required.";

    for (const [label, url] of [
        ["Poster URL", p.posterUrl],
        ["Poster thumbnail URL", p.posterUrlThumbnail],
    ] as const) {
        if (url && url.trim()) {
            try {
                new URL(url);
            } catch {
                return `${label} must be a valid URL.`;
            }
        }
    }

    if (p.source === "TMDB" && (p.tmdbId == null || !Number.isFinite(p.tmdbId))) {
        return "TMDB ID is required when Source is TMDB.";
    }

    if (p.releaseYear != null && (p.releaseYear < 1800 || p.releaseYear > 2100)) {
        return "Release year must be between 1800 and 2100.";
    }
    if (p.runtimeMinutes != null && (p.runtimeMinutes < 1 || p.runtimeMinutes > 2000)) {
        return "Runtime minutes must be between 1 and 2000.";
    }

    return null;
}

export function AddItemForm({ queueId }: { queueId: string; }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);

        const payload: NewItemFields = {
            title: String(fd.get("title") ?? ""),
            description: String(fd.get("description") ?? "").trim() || null,
            type: fd.get("type") as NewItemFields["type"],
            status: fd.get("status") as NewItemFields["status"],
            priority: fd.get("priority") as NewItemFields["priority"],
            releaseYear: parseIntOrNull(String(fd.get("releaseYear") ?? "")),
            runtimeMinutes: parseIntOrNull(String(fd.get("runtimeMinutes") ?? "")),
            whereToWatch: String(fd.get("whereToWatch") ?? "").trim() || null,
            notes: String(fd.get("notes") ?? "").trim() || null,
            tags: parseTags(String(fd.get("tags") ?? "")),
            source: fd.get("source") as NewItemFields["source"],
            tmdbId: parseIntOrNull(String(fd.get("tmdbId") ?? "")),
            imdbId: String(fd.get("imdbId") ?? "").trim() || null,
            posterUrl: String(fd.get("posterUrl") ?? "").trim() || null,
            posterUrlThumbnail:
                String(fd.get("posterUrlThumbnail") ?? "").trim() || null,
        };

        payload.title = payload.title.trim();
        const validationError = validatePayload(payload);
        if (validationError) {
            setError(validationError);
            return;
        }

        startTransition(async () => {
            const result = await createEntry(queueId, payload);
            if (result.ok) {
                router.push(`/dashboard/queue/${queueId}`);
                router.refresh();
                return;
            }
            setError(result.error);
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error ? (
                <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                </p>
            ) : null}

            <div>
                <label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-destructive">*</span>
                </label>
                <input
                    id="title"
                    name="title"
                    required
                    minLength={1}
                    className={inputClass}
                    placeholder="Title"
                />
            </div>

            <div>
                <label htmlFor="description" className="text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className={inputClass}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="type" className="text-sm font-medium">
                        Type
                    </label>
                    <select
                        id="type"
                        name="type"
                        className={inputClass}
                        defaultValue="MOVIE"
                    >
                        <option value="MOVIE">Movie</option>
                        <option value="SERIES">Series</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="text-sm font-medium">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        className={inputClass}
                        defaultValue="PLANNED"
                    >
                        <option value="PLANNED">Planned</option>
                        <option value="WATCHED">Watched</option>
                        <option value="SKIPPED">Skipped</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="priority" className="text-sm font-medium">
                        Priority
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        className={inputClass}
                        defaultValue="MEDIUM"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="source" className="text-sm font-medium">
                        Source
                    </label>
                    <select
                        id="source"
                        name="source"
                        className={inputClass}
                        defaultValue="MANUAL"
                    >
                        <option value="MANUAL">Manual</option>
                        <option value="TMDB">TMDB</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="releaseYear" className="text-sm font-medium">
                        Release year
                    </label>
                    <input
                        id="releaseYear"
                        name="releaseYear"
                        type="number"
                        className={inputClass}
                        placeholder="e.g. 2024"
                        min={1800}
                        max={2100}
                    />

                </div>
                <div>
                    <label htmlFor="runtimeMinutes" className="text-sm font-medium">
                        Runtime (minutes)
                    </label>
                    <input
                        id="runtimeMinutes"
                        name="runtimeMinutes"
                        type="number"
                        className={inputClass}
                        min={1}
                        max={2000}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="whereToWatch" className="text-sm font-medium">
                    Where to watch
                </label>
                <input
                    id="whereToWatch"
                    name="whereToWatch"
                    className={inputClass}
                />
            </div>

            <div>
                <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                </label>
                <textarea id="notes" name="notes" rows={2} className={inputClass} />
            </div>

            <div>
                <label htmlFor="tags" className="text-sm font-medium">
                    Tags
                </label>
                <input
                    id="tags"
                    name="tags"
                    className={inputClass}
                    placeholder="comma, separated, tags"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="tmdbId" className="text-sm font-medium">
                        TMDB ID
                    </label>
                    <input
                        id="tmdbId"
                        name="tmdbId"
                        type="number"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="imdbId" className="text-sm font-medium">
                        IMDb ID
                    </label>
                    <input id="imdbId" name="imdbId" className={inputClass} />
                </div>
            </div>

            <div>
                <label htmlFor="posterUrl" className="text-sm font-medium">
                    Poster URL
                </label>
                <input
                    id="posterUrl"
                    name="posterUrl"
                    type="url"
                    className={inputClass}
                />
            </div>

            <div>
                <label htmlFor="posterUrlThumbnail" className="text-sm font-medium">
                    Poster thumbnail URL
                </label>
                <input
                    id="posterUrlThumbnail"
                    name="posterUrlThumbnail"
                    type="url"
                    className={inputClass}
                />
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : "Add item"}
                </Button>
                <Link
                    href={`/dashboard/queue/${queueId}`}
                    className="inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-sm font-medium hover:bg-muted"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}