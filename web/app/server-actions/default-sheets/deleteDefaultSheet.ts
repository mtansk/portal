"use server";

import "server-only";
import { FormDefaultSheet } from "@/app/(app)/company/default-sheets/_lib/form/DefaultSheetForm";
import { fetchDELETENew } from "../functions/fetchDELETENew";

export async function deleteDefaultSheet(sheet: FormDefaultSheet) {
    return await fetchDELETENew({
        url: "/company/default-sheets/",
        id: sheet.def_sheet_id,
    });
}
