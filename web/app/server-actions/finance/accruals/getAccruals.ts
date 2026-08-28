"use server";

import "server-only";
import { ApiAccrual } from "@/app/types/finance/accrual/Accruals";
import { GETParams } from "../../functions/fetchGETNew";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getAccruals({
    params,
}: {
    params?: GETParams;
}): Promise<ApiAccrual[]>;

export default async function getAccruals({
    params,
    id,
}: {
    params?: GETParams;
    id: string;
}): Promise<ApiAccrual | undefined>;

/* 

*/

export default async function getAccruals({
    id,
    params,
}: {
    id?: string;
    params?: GETParams;
}) {
    return await fetchGETNew({
        url: `/finance/accruals/`,
        id,
        params,
    });
}
