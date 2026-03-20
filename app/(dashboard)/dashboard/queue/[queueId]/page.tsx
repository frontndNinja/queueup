//Enkelt queue -> (queue detail: entries, filters, pick) import { Metadata } from 'next';
import { Metadata } from 'next';
import { queues, items } from '@/lib/dummyData';
import ListItem from '@/app/UI/list-item';


export const metadata: Metadata = {
    title: "Queue",
};

export default async function QueuePage({
    params,
}: {
    params: { queueId: string; };
}) {

    const { queueId } = await params;

    //TODO: Get queues from the database (use API)

    return (
        <>
            {queues
                .filter((queue) => queue.id === queueId)
                .map((queue) => (
                    <div key={queue.id}>
                        <div className="text-2xl font-bold">{queue.title}</div>
                        <div className="flex flex-col gap-4">
                            {queue.items.map((itemId) => {
                                const item = items.find((item) => item.id === itemId);
                                if (!item) return <p key={itemId}>{itemId}</p>;

                                return (
                                    <ListItem key={item.id} item={item} />
                                );
                            })}
                        </div>
                    </div>
                ))}
        </>
    );
}
