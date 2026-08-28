import getUsers from "@/app/server-actions/users/getUsers";

import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import ReductionsMain from "./ReductionsMain";
import getDepts from "@/app/server-actions/departments/getDepts";
import getReductions from "@/app/server-actions/finance/reductions/getReductions";
import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";
import getDebts from "@/app/server-actions/finance/debts/getDebts";
import { filterExistingUsersByDate } from "@/app/(app)/(sheets)/schedule/_lib/ScheduleParent";

export default async function ReductionsParent({
    periodOptions,
    searchParams,

    type,
}: {
    periodOptions: PeriodOptions;
    searchParams: FinanceSearchParams;

    type: "list" | "grouped";
}) {
    const [reductions, users, depts, debts] = await Promise.all([
        getReductions({
            params: {
                start: periodOptions.start,
                end: periodOptions.end,
            },
        }),
        getUsers({}),
        getDepts({}),
        getDebts({}),
    ]);

    const filteredUsers = filterExistingUsersByDate(users, searchParams);

    return (
        <ReductionsMain
            reductions={reductions}
            users={filteredUsers}
            depts={depts}
            debts={debts}
            searchParams={searchParams}
            typeOfPage={type}
        />
    );
}
