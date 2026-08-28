"use server";

import "server-only";

import { SQLObject } from "@/app/classes/finance/Reduction";
import Sheet from "@/app/classes/Sheet";
import { fetchPUTNew } from "../functions/fetchPUTNew";

export async function putSheet(sheet: SQLObject<Sheet>) {
    return await fetchPUTNew({
        url: "/sheets/",
        body: sheet,
        id: sheet.sheet_id,
    });
}
