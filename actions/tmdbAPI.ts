import { TMDBItem, EntryWithRelationsAndVotes } from "@/app/definitions/definitions";
import { tmdbData } from "@/lib/tmdb-data";
export async function getTMDBMoviesAndSeries() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDQyN2YzN2IzNDJjNGZhN2EzMzJiYjAyODFmNjFkNCIsIm5iZiI6MTc3NDYwOTU1OC45NzgsInN1YiI6IjY5YzY2NDk2YzVmZmY0NDM1NTg5YmZiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nd3ifGMvGzgU0Vklj9EIDHZGzNfP8GSSc3bH3IcgQXQ'
        }
    };

    const allItems: EntryWithRelationsAndVotes[] = [];

    const movieResponse = await fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&sort_by=popularity.desc', options)
        .then(res => res.json())
        .catch(err => console.error(err));
    const seriesResponse = await fetch('https://api.themoviedb.org/3/discover/tv?include_adult=false&sort_by=popularity.desc', options)
        .then(res => res.json())
        .catch(err => console.error(err));

    movieResponse.results.forEach((movie: TMDBItem) => {
        allItems.push(tmdbData(movie, "movie") as unknown as EntryWithRelationsAndVotes);
    });
    seriesResponse.results.forEach((series: TMDBItem) => {
        allItems.push(tmdbData(series, "series") as unknown as EntryWithRelationsAndVotes);
    });

    allItems.sort((a, b) => b.voteScore - a.voteScore);
    return allItems;
}

export async function getTMDBMovieDetails(movieId: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDQyN2YzN2IzNDJjNGZhN2EzMzJiYjAyODFmNjFkNCIsIm5iZiI6MTc3NDYwOTU1OC45NzgsInN1YiI6IjY5YzY2NDk2YzVmZmY0NDM1NTg5YmZiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nd3ifGMvGzgU0Vklj9EIDHZGzNfP8GSSc3bH3IcgQXQ'
        }
    };
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options)
        .then(res => res.json())
        .catch(err => console.error(err));
    return response;
}

export async function getTMDBSeriesDetails(seriesId: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDQyN2YzN2IzNDJjNGZhN2EzMzJiYjAyODFmNjFkNCIsIm5iZiI6MTc3NDYwOTU1OC45NzgsInN1YiI6IjY5YzY2NDk2YzVmZmY0NDM1NTg5YmZiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nd3ifGMvGzgU0Vklj9EIDHZGzNfP8GSSc3bH3IcgQXQ'
        }
    };
    const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}`, options)
        .then(res => res.json())
        .catch(err => console.error(err));
    return response;
}


function matchScore(query: string, title: string, description: string | null | undefined) {
    const q = query.trim().toLowerCase();
    if (!q) return 0;

    const t = title.toLowerCase();
    const d = (description ?? "").toLowerCase();

    // split into words for multi-term queries
    const terms = q.split(/\s+/).filter(Boolean);

    let score = 0;

    // title-based boosts
    if (t === q) score += 1000;
    if (t.startsWith(q)) score += 400;
    if (t.includes(q)) score += 200;

    // description boost
    if (d.includes(q)) score += 50;

    // term coverage
    for (const term of terms) {
        if (t.includes(term)) score += 60;
        else if (d.includes(term)) score += 10;
    }

    return score;
}
export async function searchTMDB(query: string, page: number = 1) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDQyN2YzN2IzNDJjNGZhN2EzMzJiYjAyODFmNjFkNCIsIm5iZiI6MTc3NDYwOTU1OC45NzgsInN1YiI6IjY5YzY2NDk2YzVmZmY0NDM1NTg5YmZiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nd3ifGMvGzgU0Vklj9EIDHZGzNfP8GSSc3bH3IcgQXQ'
        }
    };

    const trimmedQuery = query.trim().toLowerCase();

    const allItems: EntryWithRelationsAndVotes[] = [];

    const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?query=${trimmedQuery}&include_adult=false&language=en-US&page=${page}`, options)
        .then(res => res.json())
        .catch(err => console.error(err));
    const seriesResponse = await fetch(`https://api.themoviedb.org/3/search/tv?query=${trimmedQuery}&include_adult=false&language=en-US&page=${page}`, options)
        .then(res => res.json())
        .catch(err => console.error(err));

    movieResponse.results.forEach((movie: TMDBItem) => {
        allItems.push(tmdbData(movie, "movie") as unknown as EntryWithRelationsAndVotes);
    });
    seriesResponse.results.forEach((series: TMDBItem) => {
        allItems.push(tmdbData(series, "series") as unknown as EntryWithRelationsAndVotes);
    });

    allItems.sort((a, b) => {
        const aScore = matchScore(trimmedQuery, a.title, a.description);
        const bScore = matchScore(trimmedQuery, b.title, b.description);

        if (bScore !== aScore) return bScore - aScore;      // best match first
        if (b.voteScore !== a.voteScore) return b.voteScore - a.voteScore; // tie-break
        return (b.releaseYear ?? 0) - (a.releaseYear ?? 0); // optional tie-break
    });

    return allItems;
}