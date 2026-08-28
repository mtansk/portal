"use server";

import "server-only";
import { fetchDELETENew } from "../../functions/fetchDELETENew";

export default async function deleteDebt(debt: any) {
    return await fetchDELETENew({
        url: "/finance/debts/",
        id: debt.debt_id,
    });
}
