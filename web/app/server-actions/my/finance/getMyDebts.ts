"use server";

import "server-only";

import { GETParams } from "../../functions/fetchGETNew";
import { ApiMyDebt } from "@/app/types/finance/debts/Debts";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getMyDebts({
    params,
}: {
    params?: GETParams;
}): Promise<ApiMyDebt[]>;

export default async function getMyDebts({
    id,
    params,
}: {
    id: string;
    params?: GETParams;
}): Promise<ApiMyDebt | undefined>;

/* 

*/

export default async function getMyDebts({
    id,
    params,
}: {
    id?: string;
    params?: GETParams;
}) {
    return await fetchGETNew({
        url: `/my/finance/debts/`,
        id,
        params,
    });
}
