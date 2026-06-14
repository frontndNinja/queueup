
import { Metadata } from 'next';
import ListItem from '@/app/UI/list-item';
import { getEntryById } from '@/actions/entries';
import { EntryWithRelationsAndVotes } from '@/app/definitions/definitions';
import Breadcrumb from '@/app/UI/breadcrumb';
import { getTMDBMovieDetails, getTMDBSeriesDetails } from '@/actions/tmdbAPI';
import { TMDBItem } from '@/app/definitions/definitions';
import { tmdbData } from '@/lib/tmdb-data';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
    title: "Item",
};

export default async function ItemsPage({
    params,
    searchParams,
}: {
    params: Promise<{ itemId: string; }>;
    searchParams: Promise<{ type?: string; q?: string; }>;
}) {
    const session = await getCurrentUser();
    const sessionUser = session;

    const { itemId } = await params;
    const { type, q } = await searchParams;

    const item = await getEntryById(itemId) as EntryWithRelationsAndVotes;
    console.log("item", item);
    let movieItem;
    let seriesItem;
    let restructuredItem;

    //If item is no found in the database, try to get it from TMDB
    if (!item) {
        if (type === "series") {
            seriesItem = await getTMDBSeriesDetails(itemId) as TMDBItem;
        } else {
            movieItem = await getTMDBMovieDetails(itemId) as TMDBItem;
        }
        const itemToShow = type === "series" ? seriesItem : movieItem;

        if (!item) {
            if (itemToShow) {
                restructuredItem = tmdbData(itemToShow, type ?? "");
            } else {
                return <div>Item not found or access denied.</div>;
            }
        }
    }


    return (
        <div>
            {!item ?
                (
                    <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "TMBD", href: `/dashboard/tmdb?q=${q}` }, { label: restructuredItem?.title || "", href: "/dashboard/item/" + restructuredItem?.id }]} />
                ) : (
                    <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: item.queue.name, href: "/dashboard/queue/" + item.queue.id }, { label: item.title, href: "/dashboard/item/" + item.id }]} />
                )}

            <ListItem key={item ? item.id : restructuredItem?.id} item={item ?? restructuredItem} singleItem={true} currentUserId={sessionUser?.id ?? ""} />
        </div>
    );
}