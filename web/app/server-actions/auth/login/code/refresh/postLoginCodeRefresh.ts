"use server";

import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import "server-only";

export default async function postLoginCodeRefresh(data: { token: string }) {
    return await fetchPOSTGuest({
        url: "/auth/login/code/refresh/",
        body: data,
    });
}
