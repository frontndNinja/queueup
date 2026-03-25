//Enkelt queue -> (queue detail: entries, filters, pick) import { Metadata } from 'next';
import { Metadata } from 'next';
import ListItem from '@/app/UI/list-item';
import { getQueueById } from '@/actions/queues';
import { EntryWithRelationsAndVotes } from '@/app/definitions/definitions';
import { CirclePlusIcon } from 'lucide-react';
import Link from 'next/link';


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
            <div key={queue[0].id} className="p-4">
                <div className='flex justify-between items-centerb p-4 max-w-[900px] mx-auto'>
                    <div className="text-2xl font-bold">{queue[0].name}</div>
                    <div className="w-[30px] h-[30px]">
                        <Link href={"/dashboard/queue/" + queueId + "/add-item"} title="Add Item" className="w-full h-full hover:bg-primary/10 rounded-md flex items-center justify-center cursor-pointer">
                            <CirclePlusIcon />
                        </Link>
                    </div>
                </div>
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
