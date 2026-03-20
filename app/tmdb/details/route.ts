import { NextResponse } from "next/server";
import { tmdbSearch } from "@/lib/tmdb";
import { requireUser } from "@/lib/permissions";

export async function GET(req: Request) {
    await requireUser(); // simple rate-limit protection + keeps it private
    //! Should be different from search ⬇️
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") ?? "").trim();
    if (query.length < 2) return NextResponse.json({ results: [] });

    const results = await tmdbSearch(query);
    // map to a stable minimal shape for client
    const mapped = results.map((r: any) => ({
        tmdbId: r.id,
        tmdbType: r.media_type, // "movie" | "tv"
        title: r.media_type === "movie" ? r.title : r.name,
        year: (r.media_type === "movie" ? r.release_date : r.first_air_date)?.slice(0, 4) ?? null,
        posterPath: r.poster_path ?? null,
    }));

    return NextResponse.json({ results: mapped });
}