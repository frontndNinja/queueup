import { PrismaClient, EntryPriority, EntrySource, EntryStatus, EntryType, QueueRole, VoteValue } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Clean (respect FK order)
    await prisma.entryVote.deleteMany();
    await prisma.entry.deleteMany();
    await prisma.queueMember.deleteMany();
    await prisma.queue.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    // Users
    const [lisa, john, emma] = await Promise.all([
        prisma.user.create({
            data: {
                name: "Lisa Larsen",
                email: "lisa@example.com",
                image: "https://i.pravatar.cc/150?img=47",
                emailVerified: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                name: "John Doe",
                email: "john@example.com",
                image: "https://i.pravatar.cc/150?img=12",
                emailVerified: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                name: "Emma Stone",
                email: "emma@example.com",
                image: "https://i.pravatar.cc/150?img=32",
                emailVerified: new Date(),
            },
        }),
    ]);

    // Queues
    const movieNight = await prisma.queue.create({
        data: {
            name: "Movie Night",
            description: "Friday picks for movie night",
            ownerId: lisa.id,
        },
    });

    const bingeList = await prisma.queue.create({
        data: {
            name: "Binge List",
            description: "Series to binge this month",
            ownerId: john.id,
        },
    });

    // Members
    await prisma.queueMember.createMany({
        data: [
            { queueId: movieNight.id, userId: lisa.id, role: QueueRole.OWNER },
            { queueId: movieNight.id, userId: john.id, role: QueueRole.MEMBER },
            { queueId: movieNight.id, userId: emma.id, role: QueueRole.MEMBER },

            { queueId: bingeList.id, userId: john.id, role: QueueRole.OWNER },
            { queueId: bingeList.id, userId: lisa.id, role: QueueRole.MEMBER },
        ],
    });

    // Entries
    const lotr = await prisma.entry.create({
        data: {
            queueId: movieNight.id,
            addedByUserId: lisa.id,
            title: "The Lord of the Rings: The Return of the King",
            description: "The Lord of the Rings: The Return of the King is a movie about a man who is a wizard and he is trying to save the world from the evil.",
            type: EntryType.MOVIE,
            status: EntryStatus.PLANNED,
            priority: EntryPriority.HIGH,
            releaseYear: 2003,
            runtimeMinutes: 201,
            tags: ["fantasy", "epic"],
            source: EntrySource.TMDB,
            tmdbId: 122,
            imdbId: "4bc88bbb017a3c122d002303",
            posterUrl: "https://media.themoviedb.org/t/p/w300_and_h450_face/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
            posterUrlThumbnail: "https://media.themoviedb.org/t/p/w94_and_h141_face/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
        },
    });

    const dark = await prisma.entry.create({
        data: {
            queueId: bingeList.id,
            addedByUserId: john.id,
            title: "Dark",
            description: "Dark is a German science fiction thriller television series created by Baran bo Odar and Jantje Friese. It is the first German-language Netflix original series.",
            type: EntryType.SERIES,
            status: EntryStatus.PLANNED,
            priority: EntryPriority.MEDIUM,
            releaseYear: 2017,
            runtimeMinutes: 187,
            tags: ["mystery", "sci-fi"],
            source: EntrySource.TMDB,
            tmdbId: 70523,
            posterUrl: "https://media.themoviedb.org/t/p/w300_and_h450_face/7CFCzWIZZcnxHke3yAQiGPWXHwF.jpg",
            posterUrlThumbnail: "https://media.themoviedb.org/t/p/w94_and_h141_face/7CFCzWIZZcnxHke3yAQiGPWXHwF.jpg",
        },
    });

    const manualEntry = await prisma.entry.create({
        data: {
            queueId: movieNight.id,
            addedByUserId: emma.id,
            title: "War Machine",
            description: "War Machine is a movie about a man who is a war machine and he is trying to save the world from the evil.",
            type: EntryType.MOVIE,
            status: EntryStatus.PLANNED,
            priority: EntryPriority.LOW,
            runtimeMinutes: 110,
            releaseYear: 2026,
            whereToWatch: "Netflix",
            notes: "Recommended by Emma",
            source: EntrySource.MANUAL,
            tags: ["Action", "Thriller", "Science Fiction"],
        },
    });

    // Votes
    await prisma.entryVote.createMany({
        data: [
            { entryId: lotr.id, userId: john.id, value: VoteValue.SUPERLIKE },
            { entryId: lotr.id, userId: emma.id, value: VoteValue.LIKE },
            { entryId: dark.id, userId: lisa.id, value: VoteValue.LIKE },
            { entryId: manualEntry.id, userId: lisa.id, value: VoteValue.LIKE },
        ],
    });

    console.log("Seed complete");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });