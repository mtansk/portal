"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import "server-only";

export default async function setAuthCookie(name: string, value: string) {
    const cookiesObj = await cookies();
    const options: Partial<ResponseCookie> = {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
    };

    cookiesObj.set(name, value, options);
}
