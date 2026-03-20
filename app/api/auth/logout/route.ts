import { NextResponse } from "next/server";
export async function GET(request: Request) {
    const url = new URL(request.url);
    const callbackUrl = `${url.origin}/`;
    return NextResponse.redirect(
        `${url.origin}/api/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`
    );
}