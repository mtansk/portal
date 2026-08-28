import "server-only";

import ScheduleMain from "./ScheduleMain";

import getSheets from "../../../../server-actions/sheets/getSheets";
import getDefaultSheets from "@/app/server-actions/default-sheets/getDefaultSheets";

import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";
import getSheetRates from "@/app/server-actions/rates/sheet/getSheetRates";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { ScheduleSearchParams } from "../page";
import getReservedDates from "@/app/server-actions/sheets/getReservedDates";
import { sqlTimestampToUTCDate } from "@/app/functions/dates";
import { ApiUser } from "@/app/types/user/Users";
import { UTCDateMini } from "@date-fns/utc";
import { addDays, startOfDay } from "date-fns";

export default async function ScheduleParent({
    periodOptions,
    searchParams,
}: {
    periodOptions: PeriodOptions;
    searchParams: ScheduleSearchParams;
}) {
    const [users, sheets, sheetRates, defaultSheets, depts, reservedDates] =
        await Promise.all([
            getUsers({}),
            getSheets({
                params: {
                    start: periodOptions.start,
                    end: periodOptions.end,
                },
            }),
            getSheetRates(),
            getDefaultSheets(),
            getDepts({}),
            getReservedDates({}),
        ]);

    const filteredUsers = filterExistingUsersByDate(users, searchParams);

    return (
        <ScheduleMain
            defaultSheets={defaultSheets}
            users={filteredUsers}
            depts={depts}
            periodOptions={periodOptions}
            sheetRates={sheetRates}
            sheets={sheets}
            searchParams={searchParams}
            reservedDates={reservedDates}
        />
    );
}

export function filterExistingUsersByDate<
    T extends {
        created_at: string;
        deleted_at: string | null;
    },
>(users: T[], dates: { start: string; end: string }) {
    const startDate = new UTCDateMini(dates.start);
    const endDate = addDays(startOfDay(new UTCDateMini(dates.end)), 1);

    const filteredUsers = users.filter((user) => {
        const createdAt = sqlTimestampToUTCDate(user.created_at);
        const deletedAt =
            user.deleted_at ?
                sqlTimestampToUTCDate(user.deleted_at)
            :   new UTCDateMini("2100-01-01");

        return createdAt <= endDate && deletedAt >= startDate;
    });

    return filteredUsers;
}
