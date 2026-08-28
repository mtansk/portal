import getAccruals from "@/app/server-actions/finance/accruals/getAccruals";
import getUsers from "@/app/server-actions/users/getUsers";
import getAccrualGroups from "@/app/server-actions/accrual-groups/getAccrualGroups";
import getGeneralRates from "@/app/server-actions/rates/general/getGeneralRates";

import getSheet from "@/app/server-actions/sheets/getSheets";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";

import getDepts from "@/app/server-actions/departments/getDepts";
import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";
import getDefaultSheets from "@/app/server-actions/default-sheets/getDefaultSheets";
import getSheetRates from "@/app/server-actions/rates/sheet/getSheetRates";
import AccrualsMain from "./AccrualsMain";
import getReservedDates from "@/app/server-actions/sheets/getReservedDates";
import { filterExistingUsersByDate } from "@/app/(app)/(sheets)/schedule/_lib/ScheduleParent";

export default async function AccrualsParent({
    periodOptions,
    searchParams,

    page,
}: {
    periodOptions: PeriodOptions;
    searchParams: FinanceSearchParams;

    page: "list" | "grouped";
}) {
    const [
        accruals,
        sheets,
        accrualGroups,
        users,
        depts,
        rates,
        defaultSheets,
        sheetRates,
        reservedDates,
    ] = await Promise.all([
        getAccruals({
            params: {
                start: periodOptions.start,
                end: periodOptions.end,
            },
        }),
        getSheet({
            params: {
                start: periodOptions.start,
                end: periodOptions.end,
                paramsString: "&sheet_status=workday",
            },
        }),
        getAccrualGroups(),
        getUsers({}),
        getDepts({}),
        getGeneralRates(),
        getDefaultSheets(),
        getSheetRates(),
        getReservedDates({}),
    ]);

    const filteredUsers = filterExistingUsersByDate(users, searchParams);

    return (
        <>
            <AccrualsMain
                accruals={accruals}
                accrualGroups={accrualGroups}
                sheets={sheets}
                users={filteredUsers}
                depts={depts}
                rates={rates}
                defaultSheets={defaultSheets}
                sheetRates={sheetRates}
                reservedDates={reservedDates}
                searchParams={searchParams}
                typeOfPage={page}
            />
        </>
    );
}
