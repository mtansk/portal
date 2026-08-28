"use server";

import "server-only";

import { ApiTax } from "@/app/types/finance/taxes/Taxes";
import { GETParams } from "../../functions/fetchGETNew";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getTaxes({
    params,
}: {
    params?: GETParams;
}): Promise<ApiTax[]>;

export default async function getTaxes({ params }: { params?: GETParams }) {
    if (params?.payslip_id === undefined) {
        return [];
    }

    return await fetchGETNew({
        url: "/finance/taxes/",
        params,
    });
}
