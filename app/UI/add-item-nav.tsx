"use client";
import { CirclePlusIcon } from "lucide-react";
import Button from "./base/button";
import { useState, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";
import AddSearchTMDB from "./add-search-tmdb";
import { User } from "../definitions/definitions";
import { EntryWithRelationsAndVotes } from "../definitions/definitions";
import ModalPortal from "./modal-portal";
import type { getQueueById } from '@/actions/queues';
import { searchTMDB } from '@/actions/tmdbAPI';

type QueueWithEntries = NonNullable<Awaited<ReturnType<typeof getQueueById>>>;

type AddItemNavProps = {
    queueId: string;
    user: User;
    searchUrl: string;
    query: string | undefined;
    queue: QueueWithEntries | null;
};

export default function AddItemNav({ queueId, user, query }: AddItemNavProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [moviesAndSeries, setMoviesAndSeries] = useState<EntryWithRelationsAndVotes[]>([]);

    const handleToggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchMoviesAndSeries = async () => {
            if (query && query.length > 0) {
                setMoviesAndSeries(query ? await searchTMDB(query, 1) : []);
            } /* else {
                setMoviesAndSeries(await getTMDBMoviesAndSeries());
            } */
        };
        fetchMoviesAndSeries();
    }, [isOpen, query]);


    return (
        <>
            <div className="w-[30px] h-[30px]">
                <div title="Add Item" className="w-full h-full relative hover:bg-primary/10 rounded-md flex items-center justify-center cursor-pointer">
                    <CirclePlusIcon onClick={handleToggleMenu} />
                    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                        <nav className={`absolute bg-lighter-background p-2 flex flex-col gap-2 rounded-md shadow-md w-[200px] top-10 right-0 ${isOpen ? "block" : "hidden"}`}>
                            <Button text="Add item from TMDB" icon="PlusIcon" action={() => { setIsSearchOpen(!isSearchOpen); }} />
                            <Button text="Add item manually" icon="FilePlusIcon" goTo={"/dashboard/queue/" + queueId + "/add-item"} />
                        </nav>
                    </ClickAwayListener>
                </div>
            </div>

            {isSearchOpen ? (
                <ModalPortal>
                    <div className="absolute top-0 left-0 right-0 bottom-0 z-100 w-screen h-screen bg-background/50">
                        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4">
                            <div className="w-full max-w-[80vw] max-h-[80vh] h-[80vh] overflow-y-auto rounded-md bg-lighter-background p-4">
                                <AddSearchTMDB queueId={queueId} user={user} moviesAndSeries={moviesAndSeries} setIsSearchOpen={setIsSearchOpen} />                            </div>
                        </div>
                    </div>
                </ModalPortal>
            ) : null}
        </>
    );
}