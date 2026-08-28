"use server";

import "server-only";

import Reduction, { SQLObject } from "@/app/classes/finance/Reduction";
import { fetchPOSTNew } from "../../functions/fetchPOSTNew";
import { parseIdsToArray } from "@/app/functions/objectKeys";

export default async function postReduction(reduction: SQLObject<Reduction>) {
    const array = parseIdsToArray(reduction, "reduction");

    return await fetchPOSTNew({
        url: "/finance/reductions/",
        body: array,
    });
}
