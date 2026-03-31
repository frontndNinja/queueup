import Image from "next/image";
import Pill from "./base/pill";
import Link from "next/link";
import { EntryWithRelationsAndVotes } from "@/app/definitions/definitions";
import type { QuickAction } from "@/app/definitions/small-definitions";
import QuickActions from "./quick-actions";
import AddTMDBItemToQueue from "./add-tmdb-item-to-queue";
import DeleteEntryButton from "./form-elements/delete-entry-button";

export default function ListItem({ item, singleItem, currentUserId, addItem, alreadyInQueue, onAdded }: { item: EntryWithRelationsAndVotes; singleItem?: boolean; statusOptions?: QuickAction; currentUserId: string; addItem?: boolean; alreadyInQueue?: boolean; onAdded?: (tmdbId: number) => void; }) {

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

    const typeIcon = item.type === "MOVIE" ? "FilmIcon" : "TvMinimalPlayIcon";
    const statusIcon = item.status === "PLANNED" ? "CheckIcon" : item.status === "WATCHED" ? "ClockCheckIcon" : "OctagonXIcon";
    const statusColor = item.status === "PLANNED" ? "yellow" : item.status === "WATCHED" ? "green" : "red";
    const priorityColor = item.priority === "LOW" ? "green" : item.priority === "MEDIUM" ? "blue" : "red";
    const priorityIcon = item.priority === "LOW" ? "CircleChevronDownIcon" : item.priority === "MEDIUM" ? "CircleMinusIcon" : "CircleChevronUpIcon";

    const formatText = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };
    const list = (
        <div className="md:flex gap-8 items-center py-4 max-w-[900px] mx-auto">
            <div className={`${!singleItem ? "w-[120px] h-[180px]" : "w-full md:w-[40vw] max-w-[400px] aspect-9/14 mb-6 md:mb-0 mx-auto md:mx-0"}`}>
                {!singleItem ? (
                    <Link href={`/dashboard/item/${item.id}?type=${item.type.toLowerCase()}`} key={item.title}>
                        <Image src={poster} alt={item.title} width={singleItem ? 400 : 120} height={singleItem ? 600 : 180} className="object-cover w-full h-full" />
                    </Link>
                ) : (
                    <Image src={poster} alt={item.title} width={400} height={600} className="object-cover w-full h-full" />
                )}
            </div>
            <div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        {!singleItem ? (
                            <Link href={`/dashboard/item/${item.id}?type=${item.type.toLowerCase()}`} key={item.title}>
                                <h3 className={`${singleItem ? "text-md-h2 mb-3" : "text-sm-h2 mb-2"} font-medium tracking-[0.2px] max-w-[500px]`}>{item.title}</h3>
                            </Link>
                        ) : (
                            <h3 className={`text-md-h2 mb-3 font-medium tracking-[0.2px] max-w-[500px]`}>{item.title}</h3>
                        )}
                        {addItem && (
                            <AddTMDBItemToQueue item={item} alreadyInQueue={alreadyInQueue} onAdded={onAdded} />
                        )}
                    </div>
                    <div className={`flex flex-wrap items-center gap-2 ${singleItem ? "mb-4" : "mb-2"}`}>
                        <Pill text={formatText(item.type)} icon={typeIcon} />
                        <Pill text={formatText(item.status)} color={statusColor} icon={statusIcon} />
                        <Pill text={formatText(item.priority)} color={priorityColor} icon={priorityIcon} />
                        <Pill text={item.voteScore.toString()} color="primary" icon="StarIcon" />
                        {!addItem && item.queueId !== "0" && (
                            <div className="relative ml-3 rounded-full hover:border border-primary/50 hover:bg-primary/10 w-[30px] h-[30px] flex items-center justify-center">
                                <QuickActions item={item} currentUserId={currentUserId} />
                            </div>
                        )}
                        {!singleItem && !addItem && (
                            <DeleteEntryButton entryId={item.id} queueId={item.queueId} />
                        )}
                    </div>
                    <p className={`text-sm w-full text-gray-500 md:max-w-md ${singleItem ? "line-clamp-none" : "line-clamp-3"} mb-2`}>{item.description}</p>
                    {singleItem && item.releaseDate && (
                        <p className={`text-sm w-full text-gray-400 md:max-w-md mb-4`}>Release Date: {new Date(item.releaseDate).toLocaleDateString()}</p>
                    )}
                    <p className={`text-sm w-full text-gray-500 md:max-w-md ${singleItem ? "line-clamp-none" : "line-clamp-3"} mb-2`}>{item.description}</p>
                    {singleItem && !item.releaseDate && item.releaseYear && (
                        <p className={`text-sm w-full text-gray-400 md:max-w-md mb-4`}>Release year: {item.releaseYear}</p>
                    )}
                    {singleItem && (
                        <div className="flex items-center gap-2">

                            <Pill type={"underline"} color="gray" text={`${!item.tmdbId ? "Item created and added on" : "Item added from TMDB on"} ${formatLocalDateTime(item.createdAt)}`} icon="CalendarCheck2Icon" />
                        </div>
                    )}
                </div>
            </div>

        </div >
    );

    return (
        <div>
            {list}
        </div>
    );
}