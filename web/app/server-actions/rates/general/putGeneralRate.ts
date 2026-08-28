"use server";

import "server-only";
import { FormGeneralRate } from "@/app/(app)/company/rates/general-rates/_lib/form/GeneralRateForm";
import { fetchPUTNew } from "../../functions/fetchPUTNew";

export async function putGeneralRate(rate: FormGeneralRate) {
    return await fetchPUTNew({
        url: "/company/rates/general-rates/",
        body: rate,
        id: rate.general_rate_id,
    });
}
