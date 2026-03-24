import type { Metadata } from "next";
import Link from "next/link";
import { getQueueById } from "@/actions/queues";
import { AddItemForm } from "@/app/UI/form-elements/add-item-form";

export const metadata: Metadata = {
    title: "Add item",
};

export default async function AddItemPage({
    params,
}: {
    params: Promise<{ queueId: string; }>;
}) {
    const { queueId } = await params;
    const queues = await getQueueById(queueId);

    if (!queues?.length) {
        return <div className="p-4">Queue not found.</div>;
    }

    const queue = queues[0];

    return (
        <div className="mx-auto max-w-2xl p-4">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Add item</h1>
                <Link
                    href={`/dashboard/queue/${queueId}`}
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                    Back to {queue.name}
                </Link>
            </div>
            <AddItemForm queueId={queueId} />
        </div>
    );
}