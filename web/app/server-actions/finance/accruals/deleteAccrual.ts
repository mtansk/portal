"use server";

import "server-only";

import { SQLObject } from "@/app/classes/finance/Reduction";
import Accrual from "@/app/classes/finance/Accrual";
import { fetchDELETENew } from "../../functions/fetchDELETENew";

export default async function deleteAccrual(accrual: SQLObject<Accrual>) {
    return await fetchDELETENew({
        url: "/finance/accruals/",
        id: accrual.accrual_id,
    });
}
