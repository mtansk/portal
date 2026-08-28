"use server";

import "server-only";

import Payment from "@/app/classes/finance/Payment";
import { SQLObject } from "@/app/classes/finance/Reduction";
import { fetchPOSTNew } from "../../functions/fetchPOSTNew";
import { parseIdsToArray } from "@/app/functions/objectKeys";

export default async function postPayment(payment: SQLObject<Payment>) {
    const array = parseIdsToArray(payment, "payment");

    return await fetchPOSTNew({
        url: "/finance/payments/",
        body: array,
    });
}
