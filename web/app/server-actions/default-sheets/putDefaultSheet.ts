"use server";

import "server-only";
import { FormDefaultSheet } from "@/app/(app)/company/default-sheets/_lib/form/DefaultSheetForm";
import { fetchPUTNew } from "../functions/fetchPUTNew";

export async function putDefaultSheet(sheet: FormDefaultSheet) {
    return await fetchPUTNew({
        url: "/company/default-sheets/",
        body: sheet,
        id: sheet.def_sheet_id,
    });
}
