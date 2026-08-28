"use server";

import "server-only";

import Reduction, { SQLObject } from "@/app/classes/finance/Reduction";
import { fetchPUTNew } from "../../functions/fetchPUTNew";

export default async function putReduction(reduction: SQLObject<Reduction>) {
    return await fetchPUTNew({
        url: "/finance/reductions/",
        body: reduction,
        id: reduction.reduction_id,
    });
}
