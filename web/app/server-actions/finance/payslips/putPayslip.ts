"use server";

import "server-only";

import { fetchPUTNew } from "../../functions/fetchPUTNew";

export default async function putPayslip(payslip: any) {
    return await fetchPUTNew({
        url: "/finance/payslips/",
        id: payslip.payslip_id,
        body: payslip,
    });
}
