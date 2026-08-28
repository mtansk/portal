"use server";

import "server-only";
import { GETParams } from "../../functions/fetchGETNew";
import fetchGETNew from "../../functions/fetchGETNew";
import { ApiMyPayment } from "@/app/types/finance/payments/Payments";

export default async function getMyPayments({
    params,
}: {
    params: GETParams;
}): Promise<ApiMyPayment[]> {
    return await fetchGETNew({
        url: `/my/finance/payments/`,
        params,
    });
}
