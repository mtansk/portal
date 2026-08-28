import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import PayslipsMain from "./PayslipsMain";
import { PayslipsSearchParams } from "../../page";
import getUsers from "@/app/server-actions/users/getUsers";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";
import getDepts from "@/app/server-actions/departments/getDepts";
import { filterExistingUsersByDate } from "@/app/(app)/(sheets)/schedule/_lib/ScheduleParent";

export default async function PayslipsParent({
    periodOptions,
    searchParams,
}: {
    periodOptions: PeriodOptions;
    searchParams: PayslipsSearchParams;
}) {
    const [payslips, users, depts] = await Promise.all([
        getPayslips({
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
        <PayslipsMain
            periodOptions={periodOptions}
            searchParams={searchParams}
            payslips={payslips}
            users={filteredUsers}
            depts={depts}
        />
    );
}
