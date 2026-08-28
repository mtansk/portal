"use server";

import { SQLObject } from "@/app/classes/finance/Reduction";
import Accrual from "@/app/classes/finance/Accrual";
import { fetchPOSTNew } from "../../functions/fetchPOSTNew";
import { parseIdsToArray } from "@/app/functions/objectKeys";

export default async function postAccrual(accrual: SQLObject<Accrual>) {
    const array = parseIdsToArray(accrual, "accrual");

    return await fetchPOSTNew({
        url: "/finance/accruals/",
        body: array,
    });
}
