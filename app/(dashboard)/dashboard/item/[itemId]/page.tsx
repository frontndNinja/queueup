//Enkelt queue -> (queue detail: entries, filters, pick) import { Metadata } from 'next';
import { Metadata } from 'next';
import Pill from '@/app/UI/base/pill';
import Image from 'next/image';
import { items, users } from '@/lib/dummyData';
import ListItem from '@/app/UI/list-item';


export const metadata: Metadata = {
    title: "Item",
};

export default async function ItemsPage({
    params,
}: {
    params: { itemId: string; };
}) {

    const { itemId } = await params;

    //TODO: Get items from the database (use API)


    return (
        items.map((item) => (
            item.id === itemId && (
                <ListItem key={item.id} item={item} singleItem={true} />
                /*  <div className="flex gap-4" key={item.title}>
                    <Image src={item.posterUrl} alt={item.title} width={300} height={500} />
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Pill text={item.type} color={`${item.type === "movie" ? "purple" : "blue"}`} />
                            <Pill text={item.addedData.status} color="green" />
                            <Pill text={item.addedData.priority} color={`${item.addedData.priority === "low priority" ? "grey" :
                                item.addedData.priority === "medium priority" ? "yellow" :
                                    "green"}`} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-bold">{item.title}</p>
                            <p className="text-sm text-gray-500 max-w-xs line-clamp-3">{item.description}</p>
                            <p className="text-sm text-gray-500">Added: {formatLocalDateTime(item.createdAt)}</p>
                            {!item.tmdb.tmdbId && item.addedData.ownerId &&
                                <p className="text-sm text-gray-500">Item created and added on {formatLocalDateTime(item.createdAt)} by: {users.find((user) => user.id === item.addedData.ownerId)?.name}</p>}
                            {item.tmdb.tmdbId && item.addedData.ownerId && <p className="text-sm text-gray-500"> Item added from TMDB on {formatLocalDateTime(item.createdAt)} by: {users.find((user) => user.id === item.addedData.ownerId)?.name}</p>}
                        </div>
                    </div>

                </div> */
            )
        ))
    );
}