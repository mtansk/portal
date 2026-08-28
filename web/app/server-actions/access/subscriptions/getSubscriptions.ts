"use server";

import "server-only";
import { ApiSubscription } from "@/app/types/access/Subscriptions";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getSubscriptions(): Promise<ApiSubscription[]> {
    return await fetchGETNew({
        url: "/access/subscriptions/",
        options: {
            debug: false,
        },
    });
}
