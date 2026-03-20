//fetch-wrapper til TMDb.
const TMDB_BASE = "https://api.themoviedb.org/3";

function tmdbUrl(path: string, params?: Record<string, string>) {
    const url = new URL(TMDB_BASE + path);
    url.searchParams.set("api_key", process.env.TMDB_API_KEY!);
    if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return url;
}

export async function tmdbSearch(query: string) {
    // Use multi search and filter out "person"
    const url = tmdbUrl("/search/multi", { query, include_adult: "false", language: "en-US" });
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("TMDB_SEARCH_FAILED");
    const data = await res.json();
    const results = (data.results ?? []).filter((r: any) => r.media_type === "movie" || r.media_type === "tv");
    return results;
}

export async function tmdbDetails(type: "movie" | "tv", id: number) {
    const url = tmdbUrl(`/${type}/${id}`, { language: "en-US" });
    const res = await fetch(url, { next: { revalidate: 60 * 60 } });
    if (!res.ok) throw new Error("TMDB_DETAILS_FAILED");
    return res.json();
}

export async function tmdbExternalIds(type: "movie" | "tv", id: number) {
    const url = tmdbUrl(`/${type}/${id}/external_ids`);
    const res = await fetch(url, { next: { revalidate: 60 * 60 } });
    if (!res.ok) throw new Error("TMDB_EXTERNAL_IDS_FAILED");
    return res.json();
}