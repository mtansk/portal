"use server";

import "server-only";

import { GETParams } from "../../functions/fetchGETNew";
import { ApiTaxDeduction } from "@/app/types/finance/tax-deductions/TaxDeduction";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getTaxDeductions({
    params,
}: {
    params?: GETParams;
}): Promise<ApiTaxDeduction[]>;

export default async function getTaxDeductions({
    params,
}: {
    params?: GETParams;
}) {
    if (params?.payslip_id === undefined) {
        return [];
    }

    return await fetchGETNew({
        url: "/finance/tax-deductions/",
        params,
    });
}
