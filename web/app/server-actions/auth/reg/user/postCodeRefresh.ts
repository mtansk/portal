"use server";

import "server-only";
import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";

export default async function postCodeRefresh(data: { token: string }) {
    return await fetchPOSTGuest({
        url: "/auth/code/refresh/",
        body: data,
    });
}
