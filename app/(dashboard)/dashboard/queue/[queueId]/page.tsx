//Enkelt queue -> (queue detail: entries, filters, pick) import { Metadata } from 'next';
import { Metadata } from 'next';
import ListItem from '@/app/UI/list-item';
import { getQueueById } from '@/actions/queues';
import { EntryWithRelations } from '@/app/definitions/definitions';


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
                <div className="text-2xl font-bold">{queue[0].name}</div>
                <div className="flex flex-col gap-4">
                    {queue[0].entries.map((entry) => {
                        return (
                            <ListItem key={entry.id} item={entry} />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
