"use server";

import "server-only";

import { GETParams } from "../../functions/fetchGETNew";
import { ApiSocialFee } from "@/app/types/finance/social-fees/SocialFees";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getSocialFees({
    params,
}: {
    params?: GETParams;
}): Promise<ApiSocialFee[]>;

export default async function getSocialFees({
    params,
}: {
    params?: GETParams;
}) {
    if (params?.payslip_id === undefined) {
        return [];
    }

    return await fetchGETNew({
        url: "/finance/social-fees/",
        params,
    });
}
