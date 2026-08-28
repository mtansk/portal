"use server";

import "server-only";
import { ApiSheetRate } from "@/app/types/sheet-rate/SheetRates";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getSheetRates(): Promise<ApiSheetRate[]>;

export default async function getSheetRates() {
    return await fetchGETNew({
        url: "/company/rates/sheet-rates/",
    });
}
