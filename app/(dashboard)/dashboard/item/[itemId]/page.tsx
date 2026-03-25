
import { Metadata } from 'next';
import ListItem from '@/app/UI/list-item';
import { getEntryById } from '@/actions/entries';
import type { QuickAction } from "@/app/definitions/small-definitions";
import { EntryWithRelationsAndVotes } from '@/app/definitions/definitions'; import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
    title: "Item",
};

export default async function ItemsPage({
    params,
}: {
    params: { itemId: string; };
}) {

    const { itemId } = await params;
    const item = await getEntryById(itemId) as EntryWithRelationsAndVotes;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!item) {
        return <div>Item not found or access denied.</div>;
    }

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
            <ListItem key={item.id} item={item} singleItem={true} allOptions={allOptions} currentUserId={sessionUser?.id ?? ""} />
        </div>
    );
}