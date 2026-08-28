"use server";

import "server-only";
import { FormSheetRate } from "@/app/(app)/company/rates/sheet-rates/_lib/form/SheetRateForm";
import { fetchPOSTNew } from "../../functions/fetchPOSTNew";

export async function postSheetRate(rate: FormSheetRate) {
    return await fetchPOSTNew({
        url: "/company/rates/sheet-rates/",
        body: rate,
    });
}
