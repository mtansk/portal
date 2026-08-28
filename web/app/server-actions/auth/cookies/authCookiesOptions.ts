import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const authCookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
};
