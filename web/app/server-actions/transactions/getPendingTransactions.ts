"use server";

import "server-only";

import fetchGETNew from "../functions/fetchGETNew";
import { ApiTransaction } from "@/app/types/access/Transactions";

export default async function getPendingTransactions(): Promise<
    ApiTransaction[]
> {
    return await fetchGETNew({
        url: "/transactions/pending/",
    });
}
