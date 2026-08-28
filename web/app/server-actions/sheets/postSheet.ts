"use server";

import "server-only";

import { SQLObject } from "@/app/classes/finance/Reduction";
import Sheet from "@/app/classes/Sheet";
import { parseIdsToArray } from "@/app/functions/objectKeys";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postSheet(sheet: SQLObject<Sheet>) {
    const array = parseIdsToArray(sheet, "sheet");

    return await fetchPOSTNew({
        url: "/sheets/",
        body: array,
    });
}
