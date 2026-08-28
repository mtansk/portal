import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { ApiUser } from "@/app/types/user/Users";
import { memo } from "react";
import React from "react";
import { ApiDept } from "@/app/types/depts/Depts";
import CalendarBody from "./CalendarBody";

import styles from "./css/calendar-container.module.scss";
import { SearchParams } from "next/dist/server/request/search-params";

const CalendarTable = memo(function CalendarTable({
    periodOptions,
    monthBasis = "day",
    depts,
    users,

    TableCell,
    RowTotalCell,
    ColumnTotalCell,

    RowTotalHeader,
    ColumnTotalHeader,

    columnWidths,

    placeholderText,
    isLoading,

    searchParams,
    useHeaderNavigation,
    navigationFn,
}: {
    periodOptions: PeriodOptions;
    monthBasis?: "day" | "week";
    depts: ApiDept[];
    users: ApiUser[];

    TableCell: ({ day, user }: { day: Date; user: ApiUser }) => React.ReactNode;
    RowTotalCell?: ({ user }: { user: ApiUser }) => React.ReactNode;
    ColumnTotalCell?: ({ day }: { day: Date }) => React.ReactNode;

    RowTotalHeader?: () => React.ReactNode;
    ColumnTotalHeader?: () => React.ReactNode;

    columnWidths?: {
        body: string;
        rowTotal: string;
    };

    placeholderText?: string;
    isLoading?: boolean;

    searchParams?: SearchParams;
    useHeaderNavigation?: boolean;
    navigationFn?: () => void;
}) {
    const fullscreenRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className={styles.calendar_table_body_div}>
            <div
                className={styles.main_div}
                ref={fullscreenRef}
            >
                {isLoading && (
                    <div className={styles.loading}>
                        <div className="spinner"></div>
                    </div>
                )}
                {placeholderText && (
                    <div className={styles.calendar_placeholder}>
                        {placeholderText}
                    </div>
                )}
                <CalendarBody
                    TableCell={TableCell}
                    RowTotalCell={RowTotalCell}
                    ColumnTotalCell={ColumnTotalCell}
                    RowTotalHeader={RowTotalHeader}
                    ColumnTotalHeader={ColumnTotalHeader}
                    columnWidths={columnWidths}
                    depts={depts}
                    fullscreenRef={fullscreenRef}
                    periodOptions={periodOptions}
                    users={users}
                    monthBasis={monthBasis}
                    searchParams={searchParams}
                    useHeaderNavigation={useHeaderNavigation}
                    navigationFn={navigationFn}
                />
            </div>
        </div>
    );
});

export default CalendarTable;
