"use server";

import "server-only";

import { ApiMyTax } from "@/app/types/finance/taxes/Taxes";
import { GETParams } from "../../functions/fetchGETNew";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getMyTaxes({
    params,
}: {
    params?: GETParams;
}): Promise<ApiMyTax[]> {
    if (params?.payslip_id === undefined) {
        return [];
    }

    return await fetchGETNew({
        url: "/my/finance/taxes/",
        params,
    });
}
