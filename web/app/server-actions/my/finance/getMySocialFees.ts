"use server";

import "server-only";

import { GETParams } from "../../functions/fetchGETNew";
import { ApiMySocialFee } from "@/app/types/finance/social-fees/SocialFees";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getMySocialFees({
    params,
}: {
    params?: GETParams;
}): Promise<ApiMySocialFee[]> {
    if (params?.payslip_id === undefined) {
        return [];
    }

    return await fetchGETNew({
        url: "/my/finance/social-fees/",
        params,
    });
}
