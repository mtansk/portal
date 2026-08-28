"use server";

import "server-only";

import { PayslipSettingsApi } from "@/app/(app)/finance/payslips/_lib/modal/PayslipAddAutoModal";
import { fetchPOSTNew } from "../../functions/fetchPOSTNew";

export default async function postAutoPayslips(obj: PayslipSettingsApi) {
    return await fetchPOSTNew({
        url: "/finance/payslips/auto-payslips/",
        body: obj,
        options: {
            debug: true,
        },
    });
}
