"use server";

import "server-only";

import { fetchPOSTNew } from "../../functions/fetchPOSTNew";

export default async function postDebt(debt: any) {
    return await fetchPOSTNew({
        url: "/finance/debts/",
        body: debt,
    });
}
