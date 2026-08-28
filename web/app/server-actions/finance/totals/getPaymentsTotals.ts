"use server";

import "server-only";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";

import {
    EfoDailyTotals,
    EfoMonthlyTotals,
    EfoWeeklyTotals,
    TotalBasises,
} from "@/app/types/finance/other/Totals";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getPaymentsTotals({
    periodOptions,
    basis,
}: {
    periodOptions: PeriodOptions;
    basis: "daily";
}): Promise<EfoDailyTotals[]>;

export default async function getPaymentsTotals({
    periodOptions,
    basis,
}: {
    periodOptions: PeriodOptions;
    basis: "weekly";
}): Promise<EfoWeeklyTotals[]>;

export default async function getPaymentsTotals({
    periodOptions,
    basis,
}: {
    periodOptions: PeriodOptions;
    basis: "monthly";
}): Promise<EfoMonthlyTotals[]>;

export default async function getPaymentsTotals({
    periodOptions,
    basis,
}: {
    periodOptions: PeriodOptions;
    basis: TotalBasises;
}): Promise<EfoDailyTotals[] | EfoWeeklyTotals[] | EfoMonthlyTotals[]> {
    return await fetchGETNew({
        url: `/finance/totals/payments/`,
        params: {
            start: periodOptions.start,
            end: periodOptions.end,
            paramsString: `&basis=${basis}`,
        },
    });
}
