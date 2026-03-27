/* import { getTMDBMoviesAndSeries } from "@/actions/tmdbAPI";
import ListItem from "@/app/UI/list-item";
import { getUser } from "@/actions/users";
import { EntryWithRelationsAndVotes } from "@/app/definitions/definitions";

import TMDBSearch from "@/app/UI/tmdb-search";

export default async function TMDBPage() {
    const moviesAndSeries = await getTMDBMoviesAndSeries();

    const user = await getUser();
    if (!user) return null;

    return (
        <div>
            <TMDBSearch />

            <div className="flex flex-col gap-4">
                {moviesAndSeries.map((moviesAndSeriesItem: EntryWithRelationsAndVotes) => (
                    <div key={moviesAndSeriesItem.id}>
                        <ListItem item={moviesAndSeriesItem} currentUserId={user.id} />
                    </div>
                ))}
            </div>
        </div>
    );
} */

import { searchTMDB } from "@/actions/tmdbAPI";
import ListItem from "@/app/UI/list-item";
import { getUser } from "@/actions/users";
import { EntryWithRelationsAndVotes } from "@/app/definitions/definitions";
import TMDBSearch from "@/app/UI/tmdb-search";
import { getTMDBMoviesAndSeries } from "@/actions/tmdbAPI";

export default async function TMDBPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; }>;
}) {
    const [{ q }, user] = await Promise.all([searchParams, getUser()]);
    if (!user) return null;

    let moviesAndSeries = await getTMDBMoviesAndSeries();


    const query = q?.trim() ?? "";
    if (query.length > 0) {
        moviesAndSeries = query ? await searchTMDB(query, 1) : [];
    }

    return (
        <div>
            <TMDBSearch />


            <div className="flex flex-col gap-4">
                {moviesAndSeries.map((item: EntryWithRelationsAndVotes) => (
                    <div key={item.id}>
                        <ListItem item={item} currentUserId={user.id} />
                    </div>
                ))}
            </div>

        </div>
    );
}