
import { Metadata } from 'next';
import SignOutButton from '@/app/UI/form-elements/signout-button';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { users, queues, items } from "@/lib/dummyData";
import Image from 'next/image';
import ListItem from '@/app/UI/list-item';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";


export const metadata: Metadata = {
    title: "Dashboard",
};
//(list all queues the user is a member of)
//TODO: Get items from the database (use API)

//Hent ind fra apii med et tmdbId. Dette skal findes fra en liste af tilføjede serier/film
export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    //! NEXT: Vis alle queues der brugeren er medlem af, kun med navn, posters/navn i en karrusel for hver queue

    //TODO:
    // get queueIds from the user
    // get queues from the database
    // display queues in a carousel
    return (
        <div className="min-h-screen min-w-screen">
            <main className="bg-gray-50 w-full h-full flex gap-4 flex-col p-4">
                <h1 className="sm:text-sm-h1">Welcome back to QueueUp, {users.find((user) => user.id === userId)?.name}!</h1>
                {users.filter((user) => user.id === userId).map((user) => (
                    <div key={user.id}>
                        <div className="max-w-full">
                            <h2 className="sm:text-sm-h2 mb-2">Queues</h2>
                            {queues
                                .filter((queue) => user.queueIds.includes(queue.id))
                                .map((queue, index) => (
                                    <div key={queue.id + index}>
                                        <Link href={`/dashboard/queue/${queue.id}`}>
                                            <h3 className="sm:text-sm-h3 mb-2">{queue.title}</h3>
                                        </Link>
                                        <Carousel
                                            opts={{
                                                align: "start",
                                            }}
                                            className="w-full max-w-[calc(100%-3rem)]"
                                        >
                                            <CarouselContent>
                                                {queue.items.map((itemId, index) => {
                                                    const found = items.find((item) => item.id === itemId);
                                                    if (!found) return null;
                                                    return (<CarouselItem key={found.id + index} className="basis-1/1 md:basis-1/2 lg:basis-1/3">
                                                        <ListItem item={found} />
                                                    </CarouselItem>);
                                                })};
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </main >
        </div >
    );
}