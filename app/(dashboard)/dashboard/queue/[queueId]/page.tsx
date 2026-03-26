//Enkelt queue -> (queue detail: entries, filters, pick) import { Metadata } from 'next';
import { Metadata } from 'next';
import ListItem from '@/app/UI/list-item';
import { getQueueById } from '@/actions/queues';
import { EntryWithRelationsAndVotes } from '@/app/definitions/definitions';
import { CirclePlusIcon } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '@/app/UI/breadcrumb';
import { PencilIcon } from 'lucide-react';

export const metadata: Metadata = {
    title: "Queue",
};

export default async function QueuePage({
    params,
}: {
    params: { queueId: string; };
}) {

    const { queueId } = await params;
    const queue = await getQueueById(queueId);


    if (!queue) {
        return <div>Queue not found or access denied.</div>;
    }

    return (
        <>
            <div key={queue[0].id} className="">
                <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: queue[0].name, href: "/dashboard/queue/" + queueId }]} />
                <div className='flex justify-between items-center pt-4 pb-2'>
                    <div className="flex items-center gap-2">
                        <h1 className="sm:text-lg-p1">
                            {queue[0].name}
                        </h1>
                        <Link className="ml-2 w-[16px] h-[16px] hover:bg-primary/10 hover:text-primary rounded-md flex items-center justify-center cursor-pointer"
                            href={"/dashboard/queue/" + queueId + "/edit-queue/"} title="Edit Queue">
                            <PencilIcon />
                        </Link>
                    </div>
                    <div className="w-[30px] h-[30px]">
                        <Link href={"/dashboard/queue/" + queueId + "/add-item"} title="Add Item" className="w-full h-full hover:bg-primary/10 rounded-md flex items-center justify-center cursor-pointer">
                            <CirclePlusIcon />
                        </Link>
                    </div>
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
