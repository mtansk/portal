"use server";

import "server-only";
import { ApiGeneralRate } from "@/app/types/general-rate/GeneralRates";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getGeneralRates(): Promise<ApiGeneralRate[]>;

export default async function getGeneralRates() {
    return await fetchGETNew({
        url: "/company/rates/general-rates/",
    });
}
