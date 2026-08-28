"use server";

import "server-only";
import { ApiMyAccrual } from "@/app/types/finance/accrual/Accruals";
import { GETParams } from "../../functions/fetchGETNew";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getMyAccruals({
    params,
}: {
    params: GETParams;
}): Promise<ApiMyAccrual[]> {
    return await fetchGETNew({
        url: `/my/finance/accruals/`,
        params,
    });
}
