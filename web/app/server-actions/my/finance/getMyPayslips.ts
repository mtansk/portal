"use server";

import "server-only";
import { GETParams } from "../../functions/fetchGETNew";
import fetchGETNew from "../../functions/fetchGETNew";
import { ApiMyPayslip } from "@/app/types/finance/payslip/Payslips";

export default async function getMyPayslips({
    params,
}: {
    params?: GETParams;
}): Promise<ApiMyPayslip[]>;

export default async function getMyPayslips({
    id,
    params,
}: {
    id: string;
    params?: GETParams;
}): Promise<ApiMyPayslip | undefined>;

export default async function getMyPayslips({
    id,
    params,
}: {
    id?: string;
    params?: GETParams;
}) {
    return await fetchGETNew({
        url: `/my/finance/payslips/`,
        id,
        params,
    });
}
