import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUser } from "@/actions/users";
import { getMemberQueues } from "@/actions/queues";
import { TicketPlusIcon } from "lucide-react";


import ListItemThumb from "@/app/UI/list-item-thumb";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Breadcrumb from "@/app/UI/breadcrumb";

export const metadata: Metadata = {
    title: "Dashboard",
};

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return <div className="min-h-screen p-6">Not authenticated.</div>;
    }

    const [user, memberQueues] = await Promise.all([
        getUser(),
        getMemberQueues(),
    ]);

    const safeQueues = memberQueues ?? [];

    return (
        <div className="min-h-screen">
            <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }]} />
            <section className="">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center py-4">
                    <h1 className="sm:text-lg-p1">
                        Welcome back to QueueUp, {user?.name ?? "friend"}!
                    </h1>
                    <div className="w-[30px] h-[30px]">
                        <Link href={"/dashboard/queue/add-queue"} title="Add Item" className="w-full h-full hover:bg-primary/10 rounded-md flex items-center justify-center cursor-pointer">
                            <TicketPlusIcon />
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {safeQueues.length === 0 ? (
                        <p className="px-6 text-muted-foreground">You have no queues yet.</p>
                    ) : (
                        safeQueues.map((queue) => (
                            <div
                                key={queue.id}
                                className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(27,36,48,0.1)_15%,rgba(27,36,48,0.2)_30%,rgba(27,36,48,0.2)_50%,rgba(27,36,48,0.2)_70%,rgba(27,36,48,0.1)_85%,rgba(0,0,0,0)_100%)] text-card-foreground py-4 pb-6 rounded-sm"
                            >
                                <div className="max-w-[1440px] m-auto">
                                    <Link href={`/dashboard/queue/${queue.id}`} className="inline-flex">
                                        <h2 className="sm:text-sm-p1 mb-4 w-fit">{queue.name}</h2>
                                    </Link>

                                    {queue.entries.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No entries in this queue yet.</p>
                                    ) : (
                                        <Carousel
                                            opts={{ align: "start", loop: true }}
                                            className="w-full"
                                        >
                                            <CarouselContent>
                                                {queue.entries.map((entry) => (
                                                    <CarouselItem
                                                        key={entry.id}
                                                        className="w-full pl-4 basis-1/1 xxs:basis-1/2 xs:basis-1/3 sm:basis-1/4 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 xxl:basis-1/7"                                                >
                                                        <ListItemThumb
                                                            item={{
                                                                id: entry.id,
                                                                title: entry.title,
                                                                posterUrl: entry.posterUrl,
                                                                posterUrlThumbnail: entry.posterUrlThumbnail,
                                                                type: entry.type,
                                                            }}
                                                        />
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>

                                            <div className="flex justify-between absolute top-[-27px] right-2 w-[45px]">
                                                <CarouselPrevious className="disabled:opacity-50 disabled:pointer-events-none hover:scale-105 transition-all duration-300 hover:bg-secondary hover:border-primary/50" />
                                                <CarouselNext className="disabled:opacity-50 disabled:pointer-events-none hover:scale-105 transition-all duration-300 hover:bg-secondary hover:border-primary/50" />
                                            </div>
                                        </Carousel>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}