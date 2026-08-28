import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import {
    eachDayOfInterval,
    eachWeekOfInterval,
    eachMonthOfInterval,
} from "date-fns";
import { CSSProperties, memo, useMemo } from "react";

import styles from "./css/calendar-container.module.scss";
import { CalendarHeader } from "./CalendarHeader";
import CalendarUpperDiv from "./CalendarUpperDiv";
import { SearchParams } from "next/dist/server/request/search-params";
import { CalendarBodyContent } from "./CalendarBodyContent";
import { dateStringToUTCDate } from "@/app/functions/dates";

function getIntervalDates(
    periodOptions: PeriodOptions,
    monthBasis: "day" | "week",
) {
    const startDate = dateStringToUTCDate(periodOptions.start);
    const endDate = dateStringToUTCDate(periodOptions.end);

    if (
        (periodOptions.period === "month" && monthBasis === "day") ||
        periodOptions.period === "week"
    ) {
        return eachDayOfInterval({ start: startDate, end: endDate });
    }

    if (periodOptions.period === "month" && monthBasis === "week") {
        return eachWeekOfInterval(
            { start: startDate, end: endDate },
            { weekStartsOn: 1 },
        );
    }

    if (periodOptions.period === "year") {
        return eachMonthOfInterval({ start: startDate, end: endDate });
    }

    return [];
}

const CalendarBody = memo(function CalendarBody({
    users,
    depts,
    periodOptions,
    monthBasis = "day",
    fullscreenRef,

    TableCell,
    ColumnTotalCell,
    RowTotalCell,

    ColumnTotalHeader,
    RowTotalHeader,

    columnWidths = {
        body: "3.2rem",
        rowTotal: "3.2rem",
    },

    searchParams,
    useHeaderNavigation,
    navigationFn,
}: {
    periodOptions: PeriodOptions;

    monthBasis?: "day" | "week";
    depts: ApiDept[];
    users: ApiUser[];

    TableCell: ({
        day,
        user,
        period,
    }: {
        day: Date;
        user: ApiUser;
        period?: {
            start: string;
            end: string;
        };
    }) => React.ReactNode;
    RowTotalCell?: ({ user }: { user: ApiUser }) => React.ReactNode;
    ColumnTotalCell?: ({ day }: { day: Date }) => React.ReactNode;

    RowTotalHeader?: () => React.ReactNode;
    ColumnTotalHeader?: () => React.ReactNode;

    columnWidths?: {
        body: string;
        rowTotal: string;
    };

    fullscreenRef: React.RefObject<HTMLDivElement | null>;

    searchParams?: SearchParams;
    useHeaderNavigation?: boolean;
    navigationFn?: () => void;
}) {
    const intervalDates = useMemo(
        () => getIntervalDates(periodOptions, monthBasis),
        [periodOptions, monthBasis],
    );

    const rowStyles: CSSProperties = {
        display: "grid",
        gridTemplateColumns: `12rem repeat(${intervalDates.length}, ${columnWidths.body}) ${RowTotalHeader ? columnWidths.rowTotal : ""}`,
    };

    return (
        <>
            <CalendarUpperDiv
                periodOptions={periodOptions}
                fullscreenRef={fullscreenRef}
                intervalDates={intervalDates}
                searchParams={searchParams}
                useHeaderNavigation={useHeaderNavigation}
                navigationFn={navigationFn}
            />
            <div className={styles.scrollable}>
                <div
                    className={styles.calendar_table}
                    style={rowStyles}
                >
                    <CalendarHeader
                        RowTotalHeader={RowTotalHeader}
                        intervalDates={intervalDates}
                        periodOptions={periodOptions}
                        monthBasis={monthBasis}
                        searchParams={searchParams}
                        useHeaderNavigation={useHeaderNavigation}
                        navigationFn={navigationFn}
                    />
                    <CalendarBodyContent
                        TableCell={TableCell}
                        depts={depts}
                        intervalDates={intervalDates}
                        periodOptions={periodOptions}
                        users={users}
                        ColumnTotalCell={ColumnTotalCell}
                        ColumnTotalHeader={ColumnTotalHeader}
                        RowTotalCell={RowTotalCell}
                    />
                </div>
            </div>
        </>
    );
});

export default CalendarBody;
