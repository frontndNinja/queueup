export interface Item {
    id: string;
    queueId: string;
    addedByUserId: string;
    title: string;
    description?: string | null;
    type: "MOVIE" | "SERIES";
    status: "PLANNED" | "WATCHED" | "SKIPPED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    releaseYear: number | null;
    runtimeMinutes: number | null;
    whereToWatch: string | null;
    notes: string | null;
    tags: string[];
    source: "MANUAL" | "TMDB";
    tmdbId: number | null;
    imdbId: string | null;
    posterUrl: string | null;
    posterUrlThumbnail: string | null;
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

