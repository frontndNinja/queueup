import Image from "next/image";
import Pill from "./base/pill";
import Link from "next/link";

type QueueEntryThumb = {
    id: string;
    title: string;
    type: "MOVIE" | "SERIES";
    posterUrl: string | null;
    posterUrlThumbnail: string | null;
};

export default function ListItemThumb({ item }: { item: QueueEntryThumb; }) {

    const hasText = (v: string | null | undefined): v is string =>
        typeof v === "string" && v.trim().length > 0;

    const poster =
        hasText(item.posterUrl)
            ? item.posterUrl
            : "/placeholder-poster.png";

    return (
        <Link href={`/dashboard/item/${item.id}`}>
            <div className="flex-col gap-4">
                <div className="relative group">
                    <Image
                        src={poster}
                        alt={item.title}
                        width={200}
                        height={300}
                        className="relative top-0 left-0 object-cover w-full h-full"
                    />
                    <div className="flex items-center gap-2 absolute top-3 right-3">
                        <Pill text={item.type.toLowerCase()} color={item.type === "MOVIE" ? "yellow" : "green"} />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 absolute top-0 right-0 left-0 bg-black/50 p-2 rounded-sm w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h3 className="sm:text-sm-p3 text-white text-center">{item.title}</h3>
                    </div>
                </div>
            </div>
        </Link>
    );
}