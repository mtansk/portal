import getUsers from "@/app/server-actions/users/getUsers";

import { PeriodOptions } from "@/app/functions/urlPeriodOptions";

import getDepts from "@/app/server-actions/departments/getDepts";
import getPayments from "@/app/server-actions/finance/payments/getPayments";
import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";
import PaymentsMain from "./PaymentsMain";
import { filterExistingUsersByDate } from "@/app/(app)/(sheets)/schedule/_lib/ScheduleParent";

export default async function PaymentsParent({
    periodOptions,
    searchParams,

    type,
}: {
    periodOptions: PeriodOptions;
    searchParams: FinanceSearchParams;

    type: "list" | "grouped";
}) {
    const [payments, users, depts] = await Promise.all([
        getPayments({
            params: {
                start: periodOptions.start,
                end: periodOptions.end,
            },
        }),
        getUsers({}),
        getDepts({}),
    ]);

    const filteredUsers = filterExistingUsersByDate(users, searchParams);

    return (
        <PaymentsMain
            payments={payments}
            users={filteredUsers}
            depts={depts}
            searchParams={searchParams}
            typeOfPage={type}
        />
    );
}
