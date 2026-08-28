import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { FinanceCalendarSearchParams } from "../page";
import getAccrualsTotals from "@/app/server-actions/finance/totals/getAccrualsTotals";
import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";
import FinanceCalendarMain from "./FinanceCalendarMain";
import getReductionsTotals from "@/app/server-actions/finance/totals/getReductionsTotals";
import getPaymentsTotals from "@/app/server-actions/finance/totals/getPaymentsTotals";
import getAccrualGroups from "@/app/server-actions/accrual-groups/getAccrualGroups";
import getGeneralRates from "@/app/server-actions/rates/general/getGeneralRates";

export default async function FinanceCalendarParent({
    searchParams,
    periodOptions,
}: {
    searchParams: FinanceCalendarSearchParams;
    periodOptions: PeriodOptions;
}) {
    const [depts, users] = await Promise.all([getDepts({}), getUsers({})]);

    async function getTotals() {
        if (searchParams.object === "accruals") {
            if (periodOptions.period === "year") {
                return await getAccrualsTotals({
                    periodOptions,
                    basis: "monthly",
                });
            } else if (periodOptions.period === "month") {
                return await getAccrualsTotals({
                    periodOptions,
                    basis: "weekly",
                });
            } else {
                return await getAccrualsTotals({
                    periodOptions,
                    basis: "daily",
                });
            }
        } else if (searchParams.object === "reductions") {
            if (periodOptions.period === "year") {
                return await getReductionsTotals({
                    periodOptions,
                    basis: "monthly",
                });
            } else if (periodOptions.period === "month") {
                return await getReductionsTotals({
                    periodOptions,
                    basis: "weekly",
                });
            } else {
                return await getReductionsTotals({
                    periodOptions,
                    basis: "daily",
                });
            }
        } else if (searchParams.object === "payments") {
            if (periodOptions.period === "year") {
                return await getPaymentsTotals({
                    periodOptions,
                    basis: "monthly",
                });
            } else if (periodOptions.period === "month") {
                return await getPaymentsTotals({
                    periodOptions,
                    basis: "weekly",
                });
            } else {
                return await getPaymentsTotals({
                    periodOptions,
                    basis: "daily",
                });
            }
        }
    }

    const totals = (await getTotals()) || [];

    const [rates, accrualGroups] = await getRatesAndGroups();

    async function getRatesAndGroups() {
        if (searchParams.object === "accruals") {
            return await Promise.all([getGeneralRates(), getAccrualGroups()]);
        } else {
            return [[], []];
        }
    }

    return (
        <FinanceCalendarMain
            arrayOfTotals={totals}
            depts={depts}
            users={users}
            periodOptions={periodOptions}
            searchParams={searchParams}
            accrualGroups={accrualGroups}
            generalRates={rates}
        />
    );
}
