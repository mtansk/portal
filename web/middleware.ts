import { NextRequest, NextResponse } from "next/server";
import checkAndRefreshTokens from "./app/functions/middleware/checkAndRefreshTokens";

export default async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/") {
        const JWT = request.cookies.get("JWT")?.value;
        const accessLevel = request.cookies.get("access_level")?.value;

        const host = request.headers.get("host") ?? "localhost:3000";
        const protocol = request.nextUrl.protocol ?? "http:";

        if (!JWT) {
            return NextResponse.redirect(`${protocol}//${host}/pub/hello`);
        } else {
            if (accessLevel === "admin") {
                return NextResponse.redirect(`${protocol}//${host}/finance`);
            } else {
                return NextResponse.redirect(`${protocol}//${host}/my/finance`);
            }
        }
    }

    const response = await checkAndRefreshTokens(request);
    return response;
}

export const config = {
    matcher: [
        {
            source: "/((?!^/$|^$|api/logout|_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|icon.svg|auth|auth/.*|pub|manifest.webmanifest|apple-touch-icon.png|web-app-manifest-*.png|robots.txt|[^/]+\\.(?:png|jpe?g|svg|webp|gif|ico|avif|bmp)$).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};
