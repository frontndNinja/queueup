"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TMDBSearch() {
    const router = useRouter();
    const sp = useSearchParams();
    const [q, setQ] = useState(sp.get("q") ?? "");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const next = q.trim();
                router.push(next ? `/dashboard/tmdb?q=${encodeURIComponent(next)}` : "/dashboard/tmdb");
            }}
            className="mb-4"
        >
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search TMDB…"
                className="w-full rounded-md border border-border bg-background p-2"
            />
        </form>
    );
}