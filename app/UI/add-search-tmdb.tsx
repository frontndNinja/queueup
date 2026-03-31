"use client";

import ListItem from "./list-item";
import { EntryWithRelationsAndVotes, User } from "@/app/definitions/definitions";
import { useEffect, useState } from "react";
import Button from "./base/button";

import { getQueueTmdbIds } from "@/actions/entries";


export default function AddSearchTMDB({ moviesAndSeries, user, setIsSearchOpen, queueId }: { moviesAndSeries: EntryWithRelationsAndVotes[]; user: User; setIsSearchOpen: (isSearchOpen: boolean) => void; queueId: string; }) {
    const [q, setQ] = useState<string>("");
    const [searchItems, setSearchItems] = useState<EntryWithRelationsAndVotes[]>(moviesAndSeries);
    const [existingTmdbIdSet, setExistingTmdbIdSet] = useState<Set<number>>(new Set());


    useEffect(() => {
        const fetchMoviesAndSeries = async () => {
            if (q === "") {
                setSearchItems(moviesAndSeries);
                return;
            }
            const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(q)}&page=1`);
            const data = await res.json();
            console.log(data);
            setSearchItems(data);
        };
        fetchMoviesAndSeries();
    }, [q, moviesAndSeries]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            const ids = await getQueueTmdbIds(queueId);
            if (cancelled) return;
            setExistingTmdbIdSet(new Set(ids));
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [queueId]);

    const handleAdded = (tmdbId: number) => {
        setExistingTmdbIdSet((prev) => {
            const next = new Set(prev);
            next.add(tmdbId);
            return next;
        });
    };

    return (
        <>
            <div className="flex justify-between md:flex gap-8 items-center py-4 max-w-[900px] mx-auto">
                <div className="w-full">
                    <label htmlFor="search-tmdb" className="text-sm font-medium text-gray-700 sr-only">Search TMDB</label>
                    <input
                        id="search-tmdb"
                        value={q}
                        onChange={(e) => {
                            setQ(e.target.value);
                        }}
                        placeholder="Search TMDB…"
                        className="w-full rounded-md border border-border bg-background p-2"
                    />
                </div>
                <div className="w-fit">
                    <Button text="Close" icon="XIcon" action={() => { setIsSearchOpen(false); }} />
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {searchItems.map((item: EntryWithRelationsAndVotes) => (

                    <div key={item.id}>
                        <ListItem item={item} currentUserId={user.id} addItem={true} alreadyInQueue={item.tmdbId != null && existingTmdbIdSet.has(item.tmdbId)} onAdded={handleAdded}
                        />
                    </div>
                ))}
            </div>

        </>
    );
}