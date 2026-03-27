
import { Metadata } from 'next';
import ListItem from '@/app/UI/list-item';
import { getEntryById } from '@/actions/entries';
import type { QuickAction } from "@/app/definitions/small-definitions";
import { EntryWithRelationsAndVotes } from '@/app/definitions/definitions'; import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Breadcrumb from '@/app/UI/breadcrumb';
import { getTMDBMovieDetails, getTMDBSeriesDetails } from '@/actions/tmdbAPI';
import { TMDBItem } from '@/app/definitions/definitions';
import { tmdbData } from '@/lib/tmdb-data';

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
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    const { itemId } = await params;
    const { type, q } = await searchParams;

    const item = await getEntryById(itemId) as EntryWithRelationsAndVotes;

    let movieItem;
    let seriesItem;

    if (type === "series") {
        seriesItem = await getTMDBSeriesDetails(itemId) as TMDBItem;
    } else {
        movieItem = await getTMDBMovieDetails(itemId) as TMDBItem;
    }
    const itemToShow = type === "series" ? seriesItem : movieItem;
    let restructuredItem;
    console.log("itemToShow", itemToShow);
    if (!item) {
        if (itemToShow) {
            restructuredItem = tmdbData(itemToShow, type ?? "");
        } else {
            return <div>Item not found or access denied.</div>;
        }
    }
    console.log("after restructure", item ?? restructuredItem);
    const voteOptions: QuickAction = {
        title: "Vote",
        options: [
            { icon: "CrownIcon", text: "Superlike", id: crypto.randomUUID(), value: "SUPERLIKE" },
            { icon: "ThumbsUpIcon", text: "Like", id: crypto.randomUUID(), value: "LIKE" },
            { icon: "ThumbsDownIcon", text: "Dislike", id: crypto.randomUUID(), value: "DISLIKE" },
        ],
    };

    const priorityOptions: QuickAction = {
        title: "Priority",
        options: [
            { icon: "CircleChevronDownIcon", text: "Low", id: crypto.randomUUID(), value: "LOW" },
            { icon: "CircleMinusIcon", text: "Medium", id: crypto.randomUUID(), value: "MEDIUM" },
            { icon: "CircleChevronUpIcon", text: "High", id: crypto.randomUUID(), value: "HIGH" },
        ],
    };

    const statusOptions: QuickAction = {
        title: "Status",
        options: [
            { icon: "MonitorDownIcon", text: "Plan to watch", id: crypto.randomUUID(), value: "PLANNED" },
            { icon: "MonitorCheckIcon", text: "Watched", id: crypto.randomUUID(), value: "WATCHED" },
            { icon: "OctagonXIcon", text: "Skip", id: crypto.randomUUID(), value: "SKIPPED" },
        ],
    };

    const allOptions: QuickAction[] = [voteOptions, priorityOptions, statusOptions];
    return (
        <div>
            {!item ?
                (
                    <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "TMBD", href: `/dashboard/tmdb?q=${q}` }, { label: restructuredItem?.title || "", href: "/dashboard/item/" + restructuredItem?.id }]} />
                ) : (
                    <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: item.queue.name, href: "/dashboard/queue/" + item.queue.id }, { label: item.title, href: "/dashboard/item/" + item.id }]} />
                )}

            <ListItem key={item ? item.id : restructuredItem?.id} item={item ?? restructuredItem} singleItem={true} allOptions={allOptions} currentUserId={sessionUser?.id ?? ""} />
        </div>
    );
}