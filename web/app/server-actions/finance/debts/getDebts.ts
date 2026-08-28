"use server";

import "server-only";

import { GETParams } from "../../functions/fetchGETNew";
import { ApiDebt } from "@/app/types/finance/debts/Debts";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getDebts({
    params,
}: {
    params?: GETParams;
}): Promise<ApiDebt[]>;

export default async function getDebts({
    id,
    params,
}: {
    id: string;
    params?: GETParams;
}): Promise<ApiDebt | undefined>;

/* 

*/

export default async function getDebts({
    id,
    params,
}: {
    id?: string;
    params?: GETParams;
}) {
    return await fetchGETNew({
        url: `/finance/debts/`,
        id,
        params,
    });
}
