"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

export default function TMDBSearch({ searchUrl }: { searchUrl: string; }) {
    const router = useRouter();
    const sp = useSearchParams();
    const [q, setQ] = useState(sp.get("q") ?? "");

    const search = (next: string) => {
        setQ(next);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push(searchUrl + "?q=" + encodeURIComponent(q));
        }, 300);
        return () => clearTimeout(timeout);
    }, [q, router, searchUrl]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const next = q.trim();
                search(next);
            }}
            className="mb-4"
        >
            <input
                value={q}
                onChange={(e) => {
                    search(e.target.value);
                }}
                placeholder="Search TMDB…"
                className="w-full rounded-md border border-border bg-background p-2"
            />
        </form>
    );
}