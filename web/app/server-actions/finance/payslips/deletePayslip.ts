"use server";

import "server-only";
import { fetchDELETENew } from "../../functions/fetchDELETENew";

export default async function deletePayslip(payslip_id: string) {
    return await fetchDELETENew({
        url: "/finance/payslips/",
        id: payslip_id,
    });
}
