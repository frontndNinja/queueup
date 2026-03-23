
import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { users, queues, items } from "@/lib/dummyData";
import BaseButton from "@/app/UI/base/button";
import ListItemThumb from '@/app/UI/list-item-thumb';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';


export const metadata: Metadata = {
    title: "Dashboard",
};
//(list all queues the user is a member of)
//TODO: Get items from the database (use API)

//Hent ind fra apii med et tmdbId. Dette skal findes fra en liste af tilføjede serier/film
export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    return (
        <div className="min-h-screen">
            <section className="w-full h-full flex gap-4 flex-col p-4">
                <h1 className="sm:text-lg-p1 mt-8 mb-4 px-6">Welcome back to QueueUp, {users.find((user) => user.id === userId)?.name}!</h1>
                {users.filter((user) => user.id === userId).map((user) => (
                    <div key={user.id}>
                        <div className="max-w-full">
                            {queues
                                .filter((queue) => user.queueIds.includes(queue.id))
                                .map((queue, index) => (
                                    <div key={queue.id + index} className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(27,36,48,0.1)_15%,rgba(27,36,48,0.2)_30%,rgba(27,36,48,0.2)_50%,rgba(27,36,48,0.2)_70%,rgba(27,36,48,0.1)_85%,rgba(0,0,0,0)_100%)] text-card-foreground px-6 py-4 pb-6 mb-6 rounded-sm">
                                        <div className='max-w-[1440px] m-auto'>
                                            <Link href={`/dashboard/queue/${queue.id}`} className="inline-flex">
                                                <h2 className="sm:text-sm-p1 mb-4 w-fit">{queue.title}</h2>
                                            </Link>
                                            <Carousel
                                                opts={{
                                                    align: "start",
                                                    loop: true,
                                                }}
                                                className="w-full"
                                            >
                                                <CarouselContent>
                                                    {queue.items.map((itemId, index) => {
                                                        const found = items.find((item) => item.id === itemId);
                                                        if (!found) return null;
                                                        return (<CarouselItem key={found.id + index} className="basis-1/1 xxs:basis-1/2 xs:basis-1/3 sm:basis-1/4 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 xxl:basis-1/7">
                                                            <ListItemThumb item={found} />
                                                        </CarouselItem>);
                                                    })}
                                                </CarouselContent>
                                                <div className="flex justify-between absolute top-[-27px] right-2 w-[45px]">

                                                    <CarouselPrevious className="disabled:opacity-50 disabled:pointer-events-none hover:scale-105 transition-all duration-300 hover:bg-secondary hover:border-primary/50" />
                                                    <CarouselNext className="disabled:opacity-50 disabled:pointer-events-none hover:scale-105 transition-all duration-300 hover:bg-secondary hover:border-primary/50" />
                                                </div>
                                            </Carousel>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </section >
        </div >
    );
}