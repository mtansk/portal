"use server";

import { fetchPOSTNew } from "@/app/server-actions/functions/fetchPOSTNew";
import "server-only";

export default async function postCompRegCodeRefresh(data: { token: string }) {
    return await fetchPOSTNew({
        url: "/auth/reg/company/reg-code/refresh/",
        body: data,
    });
}
