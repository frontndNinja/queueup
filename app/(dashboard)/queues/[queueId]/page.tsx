//Enkelt queue -> (queue detail: entries, filters, pick) import { Metadata } from 'next';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Queue",
};

export default function QueuePage() {
    return (
        <div>
            <p>this is a queue page</p>
        </div>
    );
}