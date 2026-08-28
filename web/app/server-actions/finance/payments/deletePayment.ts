"use server";

import "server-only";

import { fetchDELETENew } from "../../functions/fetchDELETENew";

export default async function deletePayment(payment_id: string) {
    return await fetchDELETENew({
        url: "/finance/payments/",
        id: payment_id,
    });
}
