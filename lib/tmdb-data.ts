import { TMDBItem } from "@/app/definitions/definitions";

export function tmdbData(item: TMDBItem, type: string) {
    console.log("pre restructured item", item);
    return {
        id: item.id.toString(),
        tmdbId: item.id,
        title: type === "movie" ? item.title : item.name,
        description: item.overview,
        type: type === "series" ? "SERIES" : "MOVIE",
        releaseYear: new Date(item.release_date).getFullYear() ?? null,
        tags: item.genre_ids ? item.genre_ids.map((id: number) => id.toString()) : [],
        posterUrl: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
        posterUrlThumbnail: `https://image.tmdb.org/t/p/w342/${item.poster_path}`,
        queueId: "0",
        addedByUserId: "0",
        status: "PLANNED",
        priority: "MEDIUM",
        whereToWatch: null,
        notes: null,
        source: "TMDB",
        runtimeMinutes: null,
        imdbId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        queue: { id: "0", name: "TMDB" },
        votes: [],
        voteScore: Math.round(item.vote_average * 10) / 10,
    };
}