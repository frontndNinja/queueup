import { NextResponse } from "next/server";
import { searchTMDB } from "@/actions/tmdbAPI";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const page = Number(searchParams.get("page") ?? "1") || 1;

    if (!q) {
        return NextResponse.json([], { status: 200 });
    }

    const results = await searchTMDB(q, page);
    return NextResponse.json(results, { status: 200 });
}