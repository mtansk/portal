"use server";

import "server-only";

import { GETParams } from "../../functions/fetchGETNew";
import { ApiPayment } from "@/app/types/finance/payments/Payments";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getPayments({
    params,
    id,
}: {
    params?: GETParams;
    id: string;
}): Promise<ApiPayment | undefined>;

export default async function getPayments({
    params,
}: {
    params?: GETParams;
}): Promise<ApiPayment[]>;

export default async function getPayments({
    id,
    params,
}: {
    id?: string;
    params?: GETParams;
}) {
    return await fetchGETNew({
        url: `/finance/payments/`,
        id,
        params,
    });
}
