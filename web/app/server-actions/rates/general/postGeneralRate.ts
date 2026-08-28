"use server";

import "server-only";
import { FormGeneralRate } from "@/app/(app)/company/rates/general-rates/_lib/form/GeneralRateForm";
import { fetchPOSTNew } from "../../functions/fetchPOSTNew";

export async function postGeneralRate(rate: FormGeneralRate) {
    return await fetchPOSTNew({
        url: "/company/rates/general-rates/",
        body: rate,
    });
}
