import Image from "next/image";
import Pill from "./base/pill";
import Link from "next/link";
import { Item } from "@/app/definitions/definitions";
import { users } from "@/lib/dummyData";

export default function ListItem({ item, singleItem }: { item: Item; singleItem?: boolean; }) {

    singleItem = singleItem ?? false;

    const formatLocalDateTime = (value: string | number | Date) =>
        new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // optional
        }).format(new Date(value));

    //TODO: get users from API

    return (
        <Link href={`/dashboard/item/${item.id}`} key={item.title}>
            <div className="flex gap-4" key={item.id}>
                <div className={`${!singleItem && "basis-1/2 sm:basis-1/3"} w-[${singleItem ? 300 : 94}px] h-[${singleItem ? 450 : 141}px]`}>

                    <Image src={singleItem ? item.posterUrl : item.posterUrlThumbnail} alt={item.title} width={singleItem ? 300 : 94} height={singleItem ? 450 : 141} className="object-fit w-full h-full" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Pill text={item.type} color={`${item.type === "movie" ? "purple" : "blue"}`} />
                        <Pill text={item.addedData.status} color="green" />
                        <Pill text={item.addedData.priority} color={`${item.addedData.priority === "low priority" ? "grey" :
                            item.addedData.priority === "medium priority" ? "yellow" :
                                "green"}`} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="sm:text-sm-h3">{item.title}</h3>
                        <p className={`text-sm text-gray-500 max-w-md ${singleItem ? "line-clamp-none" : "line-clamp-3"}`}>{item.description}</p>
                        {singleItem && (
                            <div className="flex items-center gap-2">
                                {!item.tmdb.tmdbId && item.addedData.ownerId &&
                                    <p className="text-sm text-gray-500">Item created and added on {formatLocalDateTime(item.createdAt)} by: {users.find((user) => user.id === item.addedData.ownerId)?.name}</p>}
                                {item.tmdb.tmdbId && item.addedData.ownerId && <p className="text-sm text-gray-500"> Item added from TMDB on {formatLocalDateTime(item.createdAt)} by: {users.find((user) => user.id === item.addedData.ownerId)?.name}</p>}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Link>
    );
}