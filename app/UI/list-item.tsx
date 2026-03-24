import Image from "next/image";
import Pill from "./base/pill";
import Link from "next/link";
import { Item } from "@/app/definitions/definitions";

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

    const hasText = (v: string | null | undefined): v is string =>
        typeof v === "string" && v.trim().length > 0;

    const poster = !singleItem && hasText(item.posterUrlThumbnail)
        ? item.posterUrlThumbnail
        : singleItem && hasText(item.posterUrl)
            ? item.posterUrl
            : "/placeholder-poster.png";

    return (
        <Link href={`/dashboard/item/${item.id}`} key={item.title}>
            <div className="flex gap-4">
                <div className={`${!singleItem ? "w-[94px] h-[141px]" : "w-[300px] h-[450px]"}`}>

                    <Image src={poster} alt={item.title} width={singleItem ? 300 : 94} height={singleItem ? 450 : 141} className="object-fit w-full h-full" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Pill text={item.type} color={`${item.type === "MOVIE" ? "purple" : "blue"}`} />
                        <Pill text={item.status} color="green" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="sm:text-sm-h3">{item.title}</h3>
                        <p className={`text-sm text-gray-500 max-w-md ${singleItem ? "line-clamp-none" : "line-clamp-3"}`}>{item.description}</p>
                        {singleItem && (
                            <div className="flex items-center gap-2">
                                {!item.tmdbId &&
                                    <p className="text-sm text-gray-500">Item created and added on {formatLocalDateTime(item.createdAt)}</p>}
                                {item.tmdbId && <p className="text-sm text-gray-500"> Item added from TMDB on {formatLocalDateTime(item.createdAt)}</p>}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Link>
    );
}