export interface Item {
    id: string; //V
    title: string; //V
    description?: string | null; //V
    type: "MOVIE" | "SERIES"; //V
    releaseYear: number | null; // V
    tags: string[]; //V
    posterUrl: string | null; //V
    posterUrlThumbnail: string | null; //V
    tmdbId: number | null; //V
    runtimeMinutes: number | null; //‰
    queueId: string;
    addedByUserId: string;
    status: "PLANNED" | "WATCHED" | "SKIPPED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    whereToWatch: string | null;
    notes: string | null;
    source: "MANUAL" | "TMDB";
    imdbId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface EntryWithRelations extends Item {
    queue: EntryQueueDTO;
    votes: EntryVoteDTO[];
}
export interface EntryWithRelationsAndVotes extends EntryWithRelations {
    voteScore: number;
}

/** Fields supplied when creating an entry (`queueId` / `addedByUserId` / ids / timestamps are set server-side). */
export type NewItemFields = Omit<
    Item,
    "id" | "createdAt" | "updatedAt" | "queueId" | "addedByUserId"
>;

export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    memberships: {
        queueId: string;
    }[];
    queueIds: string[] | null;
}

export interface Queue {
    id: string;
    title: string;
    items: string[];
}


/* ############################ */
/* ## TMDB API Definitions ## */
/* ############################ */

export interface EntryVoteDTO {
    id: string;
    entryId: string;
    userId: string;
    value: "LIKE" | "SUPERLIKE" | "DISLIKE";
    createdAt: Date;
    updatedAt: Date;
}

export interface EntryQueueDTO {
    id: string;
    name: string;
}

/* ############################ */
/* ## TMDB API Definitions ## */
/* ############################ */

export interface TMDBItem {
    id: number; //tmdbId + id
    title: string; //title
    name: string; //name
    overview: string; //description
    video: boolean; //type
    release_date: string; //releaseYear
    genre_ids: number[]; //tags
    poster_path: string; //posterUrlThumbnail + posterUrl
    adult: boolean;
    backdrop_path: string;
    origin_country: string[];
    original_language: string;
    original_name: string;
    popularity: number;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
}