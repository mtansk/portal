"use server";

import "server-only";
import { IDBDebt } from "@/app/types/finance/debts/Debts";
import { fetchPUTNew } from "../../functions/fetchPUTNew";

export default async function putDebt(debt: IDBDebt) {
    return await fetchPUTNew({
        url: "/finance/debts/",
        id: debt.debt_id,
        body: debt,
    });
}
