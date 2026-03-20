export interface Item {
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    type: string;
    posterUrl: string;
    posterUrlThumbnail: string;
    source: string;
    id: string;
    tmdb: {
        tmdbId: string;
    };
    addedData: {
        ownerId: string;
        status: string;
        priority: string;
    };
}


export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}

export interface Queue {
    id: string;
    title: string;
    items: string[];
}