"use server";

import "server-only";

import { GETParams } from "../../functions/fetchGETNew";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getPayslips({
    params,
}: {
    params?: GETParams;
}): Promise<ApiPayslip[]>;

export default async function getPayslips({
    id,
    params,
}: {
    id: string;
    params?: GETParams;
}): Promise<ApiPayslip | undefined>;

/* 

*/

export default async function getPayslips({
    id,
    params,
}: {
    id?: string;
    params?: GETParams;
}) {
    return await fetchGETNew({
        url: `/finance/payslips/`,
        id,
        params,
    });
}
