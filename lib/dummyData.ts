
export const items = [{
    title: "The Lord of the Rings: The Return of the King",
    description: "The Lord of the Rings: The Return of the King is a movie about a man who is a wizard and he is trying to save the world from the evil.",
    createdAt: new Date('2026-03-19T12:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-20T11:54:00Z').toISOString(),
    type: "movie",
    posterUrlThumbnail: "https://media.themoviedb.org/t/p/w94_and_h141_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    posterUrl: "https://media.themoviedb.org/t/p/w300_and_h450_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    source: "tmdb",
    id: "5c0aa907c3a368252004c4f5",
    tmdb: {
        tmdbId: "5c0aa907c3a368252004c4f5",
    },
    addedData: {
        ownerId: "1234567890",
        status: "planned",
        priority: "medium priority",
    }
}, {
    title: "The Keepers",
    description: "The Keepers is a series about a man who is a keeper and he is trying to save the world from the evil.",
    createdAt: new Date('2026-03-19T12:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-20T11:54:00Z').toISOString(),
    type: "series",
    posterUrlThumbnail: "https://media.themoviedb.org/t/p/w94_and_h141_face/jOTLe14XueFZpy6vKVO28cmtcJB.jpg",
    posterUrl: "https://media.themoviedb.org/t/p/w300_and_h450_face/jOTLe14XueFZpy6vKVO28cmtcJB.jpg",
    source: "tmdb",
    id: "6072e46c7c6de30029680108",
    tmdb: {
        tmdbId: "6072e46c7c6de30029680108",
    },
    addedData: {
        ownerId: "1234567891",
        status: "planned",
        priority: "low priority",
    }
}, {
    title: "Stranger things",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    createdAt: new Date('2026-03-19T12:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-20T11:54:00Z').toISOString(),
    type: "series",
    posterUrlThumbnail: "https://media.themoviedb.org/t/p/w94_and_h141_face/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    posterUrl: "https://media.themoviedb.org/t/p/w300_and_h450_face/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    source: "owner",
    id: "1234567890",
    tmdb: {
        tmdbId: "",
    },
    addedData: {
        ownerId: "1234567890",
        status: "planned",
        priority: "low priority",
    }
}];



export const users = [{
    id: "cmmyob0mu00009ketg0gpdp64",
    name: "Lisa Søndergaard",
    email: "iam@frontnd.ninja",
    image: "https://media.themoviedb.org/t/p/w94_and_h141_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    queueIds: ["92378e0d9029wiu", "92378e0d9we9wiu", "9237834d9029wiu"],
}, {
    id: "1234567891",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://media.themoviedb.org/t/p/w94_and_h141_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    queueIds: ["92378e0d9029wiu", "92378e0d9we9wiu"],
},
{
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://media.themoviedb.org/t/p/w94_and_h141_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    queueIds: [],
},
{
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    image: "https://media.themoviedb.org/t/p/w94_and_h141_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    queueIds: ["92378e0d9029wiu", "92378e0d9we9wiu", "9237834d9029wiu"],
},
{
    id: "3",
    name: "Jim Doe",
    email: "jim.doe@example.com",
    image: "https://media.themoviedb.org/t/p/w94_and_h141_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    queueIds: [],
},
{
    id: "4",
    name: "Jill Doe",
    email: "jill.doe@example.com",
    image: "https://media.themoviedb.org/t/p/w94_and_h141_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    queueIds: [],
},
{
    id: "5",
    name: "Jack Doe",
    email: "jack.doe@example.com",
    image: "https://media.themoviedb.org/t/p/w94_and_h141_face/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    queueIds: [],
}];


export const queues = [{

    id: "92378e0d9029wiu",
    title: "Sjove film",
    items: ["5c0aa907c3a368252004c4f5", "6072e46c7c6de30029680108", "1234567890", "5c0aa907c3a368252004c4f5", "6072e46c7c6de30029680108", "1234567890", "5c0aa907c3a368252004c4f5", "6072e46c7c6de30029680108", "1234567890"]
}, {
    id: "92378e0d9we9wiu",
    title: "Fede serier",
    items: ["6072e46c7c6de30029680108", "5c0aa907c3a368252004c4f5", "6072e46c7c6de30029680108", "1234567890"]
}, {
    id: "9237834d9029wiu",
    title: "Blandet",
    items: ["1234567890", "5c0aa907c3a368252004c4f5", "6072e46c7c6de30029680108"]
}
];