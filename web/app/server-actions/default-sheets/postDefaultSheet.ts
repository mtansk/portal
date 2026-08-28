"use server";

import "server-only";
import { FormDefaultSheet } from "@/app/(app)/company/default-sheets/_lib/form/DefaultSheetForm";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postDefaultSheet(sheet: FormDefaultSheet) {
    return await fetchPOSTNew({
        url: "/company/default-sheets/",
        body: sheet,
    });
}
