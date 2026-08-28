"use server";

import "server-only";
import { GETParams } from "../../functions/fetchGETNew";
import fetchGETNew from "../../functions/fetchGETNew";
import { ApiMyReduction } from "@/app/types/finance/reductions/Reductions";

export default async function getMyReductions({
    params,
}: {
    params: GETParams;
}): Promise<ApiMyReduction[]> {
    return await fetchGETNew({
        url: `/my/finance/reductions/`,
        params,
    });
}
