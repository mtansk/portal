"use server";

import "server-only";
import { SQLObject } from "@/app/classes/finance/Reduction";
import Sheet from "@/app/classes/Sheet";
import { fetchDELETENew } from "../functions/fetchDELETENew";

export async function deleteSheet(sheet: SQLObject<Sheet>) {
    return await fetchDELETENew({
        url: "/sheets/",
        id: sheet.sheet_id,
    });
}
