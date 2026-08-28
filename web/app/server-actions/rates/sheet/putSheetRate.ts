"use server";

import "server-only";
import { FormSheetRate } from "@/app/(app)/company/rates/sheet-rates/_lib/form/SheetRateForm";
import { fetchPUTNew } from "../../functions/fetchPUTNew";

export async function putSheetRate(rate: FormSheetRate) {
    return await fetchPUTNew({
        url: "/company/rates/sheet-rates/",
        body: rate,
        id: rate.sheet_rate_id,
    });
}
