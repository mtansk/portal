"use server";

import "server-only";

import { fetchPOSTNew } from "../../functions/fetchPOSTNew";

export default async function postPayslip(payslip: any) {
    return await fetchPOSTNew({
        url: "/finance/payslips/",
        body: payslip,
    });
}
