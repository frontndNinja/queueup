
import { Metadata } from 'next';
import ListItem from '@/app/UI/list-item';
import { getEntryById } from '@/actions/entries';
import { updateVote } from '@/actions/entries';

export const metadata: Metadata = {
    title: "Item",
};

export default async function ItemsPage({
    params,
}: {
    params: { itemId: string; };
}) {

    const { itemId } = await params;
    const item = await getEntryById(itemId);

    updateVote(itemId, 1);

    if (!item) {
        return <div>Item not found or access denied.</div>;
    }

    return <ListItem key={item.id} item={item} singleItem={true} />;
}