"use server";

import "server-only";

import { GETParams } from "../../functions/fetchGETNew";
import { ApiMyTaxDeduction } from "@/app/types/finance/tax-deductions/TaxDeduction";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getMyTaxDeductions({
    params,
}: {
    params?: GETParams;
}): Promise<ApiMyTaxDeduction[]> {
    if (params?.payslip_id === undefined) {
        return [];
    }

    return await fetchGETNew({
        url: "/my/finance/tax-deductions/",
        params,
    });
}
