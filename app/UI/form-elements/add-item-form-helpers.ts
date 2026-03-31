import type { NewItemFields } from "@/app/definitions/definitions";

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

export function buildNewItemFieldsFromFormData(fd: FormData): NewItemFields {
    const payload: NewItemFields = {
        title: String(fd.get("title") ?? "").trim(),
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
        posterUrlThumbnail: String(fd.get("posterUrlThumbnail") ?? "").trim() || null,
    };

    return payload;
}

export function validateNewItemFields(p: NewItemFields): string | null {
    if (!p.title.trim()) return "Title is required.";

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

    return null;
}