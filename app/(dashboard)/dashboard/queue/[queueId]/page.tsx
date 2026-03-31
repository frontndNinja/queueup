//Enkelt queue -> (queue detail: entries, filters, pick) import { Metadata } from 'next';
import { Metadata } from 'next';
import ListItem from '@/app/UI/list-item';
import { getQueueById } from '@/actions/queues';
import { EntryWithRelationsAndVotes } from '@/app/definitions/definitions';
import Link from 'next/link';
import Breadcrumb from '@/app/UI/breadcrumb';
import { PencilIcon } from 'lucide-react';
import { getTMDBMoviesAndSeries } from '@/actions/tmdbAPI';
import { searchTMDB } from '@/actions/tmdbAPI';
import AddItemNav from '@/app/UI/add-item-nav';
import { getUser } from '@/actions/users';
import { User } from '@/app/definitions/definitions';

export const metadata: Metadata = {
    title: "Queue",
};

export default async function QueuePage({
    params,
    searchParams,
}: {
    params: { queueId: string; };
    searchParams: Promise<{ q?: string; }>;
}) {

    const { queueId } = await params;
    const { q } = await searchParams;
    const queue = await getQueueById(queueId);
    console.log("queue", queue);
    let moviesAndSeries = await getTMDBMoviesAndSeries();
    const user = await getUser() as User;
    if (!user) return null;


    if (!queue) {
        return <div>Queue not found or access denied.</div>;
    }
    const query = q?.trim() ?? "";
    if (query.length > 0) {
        moviesAndSeries = query ? await searchTMDB(query, 1) : [];
    }


    return (
        <>
            <div key={queue[0].id} className="w-full h-full">
                <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: queue[0].name, href: "/dashboard/queue/" + queueId }]} />
                <div className='flex justify-between items-center pt-4 pb-2 relative'>
                    <div className="flex items-center gap-2">
                        <h1 className="sm:text-lg-p1">
                            {queue[0].name}
                        </h1>
                        <Link className="ml-2 w-[16px] h-[16px] hover:bg-primary/10 hover:text-primary rounded-md flex items-center justify-center cursor-pointer"
                            href={"/dashboard/queue/" + queueId + "/edit-queue/"} title="Edit Queue">
                            <PencilIcon />
                        </Link>
                    </div>
                    <AddItemNav queueId={queueId} user={user} moviesAndSeries={moviesAndSeries} searchUrl={"/dashboard/queue/" + queueId} />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{queue[0].description}</p>
                <div className="flex flex-col gap-4">
                    {queue[0].entries.map((entry) => {
                        return (
                            <ListItem key={entry.id} item={entry as EntryWithRelationsAndVotes} currentUserId={queue[0].ownerId} />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
