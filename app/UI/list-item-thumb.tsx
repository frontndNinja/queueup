import Image from "next/image";
import Pill from "./base/pill";
import Link from "next/link";
import { Item } from "@/app/definitions/definitions";

export default function ListItemThumb({ item }: { item: Item; }) {

    return (
        <Link href={`/dashboard/item/${item.id}`} key={item.title} className="group">
            <div className="flex-col gap-4" key={item.id}>
                <div className={`relative w-full h-full`}>
                    <div className={`absolute w-full h-full bg-black/75 hidden group-hover:flex z-10 transition duration-500 items-center justify-center p-2 text-center lg:p-6 rounded-sm`}>
                        <h3 className="sm:text-sm-p4 lg:text-lg-p4 text-white">{item.title}</h3>
                    </div>
                    <Image src={item.posterUrl} alt={item.title} width={200} height={300} className="relative top-0 left-0 object-fit w-full h-full rounded-sm" />
                    <div className="flex items-center gap-2 absolute top-3 right-3">
                        <Pill text={item.type} color={`${item.type === "movie" ? "dark" : "light"}`} />
                    </div>
                </div>
            </div>
        </Link >
    );
}