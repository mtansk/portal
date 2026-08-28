"use server";

import "server-only";
import { SQLObject } from "@/app/classes/finance/Reduction";

import { fetchPUTNew } from "../../functions/fetchPUTNew";
import Accrual from "@/app/classes/finance/Accrual";

export default async function putAccrual(accrual: SQLObject<Accrual>) {
    return await fetchPUTNew({
        url: "/finance/accruals/",
        body: accrual,
        id: accrual.accrual_id,
    });
}
