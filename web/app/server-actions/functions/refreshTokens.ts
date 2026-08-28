"use server";

import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import setAccessStateCookies from "../auth/cookies/setAccessStateCookies";
import { ApiResponse } from "./types";
import { AuthorizationPayload } from "@/app/types/access/Access";

export default async function refreshTokens() {
    try {
        const cookiesResolved = await cookies();
        const refreshToken = cookiesResolved.get("refreshToken")?.value;

        if (!refreshToken) {
            redirect("/auth/logout");
        }

        const data = await fetch(
            `${process.env.API_HOST_NAME}/api/private/auth/token/refresh/`,
            {
                method: "POST",
                headers: {
                    contentType: "application/json",
                },
                body: JSON.stringify({
                    token: refreshToken,
                }),
            },
        );

        const res: ApiResponse<AuthorizationPayload | null> = await data.json();

        console.log(res.code);

        if (
            res.code !== 200 ||
            !res.data ||
            !res.data[0] ||
            !res.data[0].JWT ||
            !res.data[0].refreshToken
        ) {
            redirect("/auth/logout");
        }

        await setAccessStateCookies(res.data[0]);
    } catch (e) {
        unstable_rethrow(e);
        redirect("/auth/logout");
    }
}
