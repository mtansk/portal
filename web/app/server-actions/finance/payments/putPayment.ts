"use server";

import "server-only";

import Payment from "@/app/classes/finance/Payment";
import { SQLObject } from "@/app/classes/finance/Reduction";
import { fetchPUTNew } from "../../functions/fetchPUTNew";

export default async function putPayment(payment: SQLObject<Payment>) {
    return await fetchPUTNew({
        url: "/finance/payments/",
        body: payment,
        id: payment.payment_id,
    });
}
