"use server";

import "server-only";
import { FormSheetRate } from "@/app/(app)/company/rates/sheet-rates/_lib/form/SheetRateForm";
import { fetchDELETENew } from "../../functions/fetchDELETENew";

export async function deleteSheetRate(rate: FormSheetRate) {
    return await fetchDELETENew({
        url: "/company/rates/sheet-rates/",
        id: rate.sheet_rate_id,
    });
}
