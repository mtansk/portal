"use server";

import "server-only";
import { FormGeneralRate } from "@/app/(app)/company/rates/general-rates/_lib/form/GeneralRateForm";
import { fetchDELETENew } from "../../functions/fetchDELETENew";

export async function deleteGeneralRate(rate: FormGeneralRate) {
    return await fetchDELETENew({
        url: "/company/rates/general-rates/",
        id: rate.general_rate_id,
    });
}
