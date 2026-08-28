import { PeriodOptions } from "@/app/functions/urlPeriodOptions";

import { ApiSheet } from "@/app/types/sheet/Sheets";
import { ApiUser, IDBUser } from "@/app/types/user/Users";
import { memo, useCallback, useMemo } from "react";
import {
    formatISODate,
    formatUTCDate,
    timeFromSeconds,
} from "@/app/functions/dates";
import CalendarTable from "../../../../components/calendar/CalendarTable";
import Sheet, { SheetConstructorObject } from "@/app/classes/Sheet";
import { ApiDept } from "@/app/types/depts/Depts";
import { ScheduleSearchParams } from "../page";

import styles from "./css/schedule.module.scss";

const RowTotalHeader = () => (
    <div className={styles.schedule_row_total_header}>
        <div>Смены</div>
        <div>Часы</div>
    </div>
);

const ColumnTotalHeader = () => (
    <div className={styles.schedule_column_total_header}>
        Сотрудников за день:
    </div>
);

const columnWidths = {
    body: "3.2rem",
    rowTotal: "4rem",
};

export const statusLabels: Record<string, string> = {
    dayoff: "В",
    vacation: "Отп",
    excused: "Ув",
    absence: "Н",
};

const ScheduleBody = memo(function ScheduleBody({
    users,
    sheets,
    depts,
    periodOptions,

    searchParams,

    handleSheetClick,

    templateSheet,
    switchDateFn,

    isAdding,

    isLoading,

    after,
}: {
    users: ApiUser[];
    sheets: ApiSheet[];
    depts: ApiDept[];
    periodOptions: PeriodOptions;

    searchParams: ScheduleSearchParams;

    handleSheetClick: (
        id: string,
        type?: "add" | "edit",
        objectModifications?: Partial<
            Record<keyof SheetConstructorObject, unknown>
        >,
    ) => void;

    templateSheet: Sheet | null;
    switchDateFn?: (action: "add" | "delete", day: Date, user: ApiUser) => void;

    isAdding: boolean;
    isLoading?: boolean;

    after?: () => void;
}) {
    const sheetsArray: Record<
        string,
        Record<string, ApiSheet>
    > = useMemo(() => {
        let sheetsArray: Record<string, Record<string, ApiSheet>> = {};

        for (let i = 0; i < sheets.length; i++) {
            const date = sheets[i].sheet_date;
            const user = sheets[i].user_id;

            if (!sheetsArray[user]) sheetsArray[user] = {};

            sheetsArray[user][date] = sheets[i];
        }

        return sheetsArray;
    }, [sheets]);

    const ScheduleCalendarCell = useCallback(
        ({ day, user }: { day: Date; user: ApiUser }) => {
            function InnerContent({ sheet }: { sheet: ApiSheet | Sheet }) {
                if (!sheet) return null;

                if (sheet.sheet_status === "workday") {
                    const isFactual = searchParams.factual === "true";
                    const duration =
                        isFactual ? sheet.sheet_total_dur : sheet.sheet_dur_p;

                    return (
                        <>
                            <div className={styles.start}>
                                {isFactual ?
                                    sheet.sheet_f_st ?
                                        timeFromSeconds(sheet.sheet_f_st)
                                    :   "--:--"
                                :   timeFromSeconds(sheet.sheet_p_st || 0)}
                            </div>
                            <div className={styles.end}>
                                {isFactual ?
                                    sheet.sheet_f_en ?
                                        timeFromSeconds(sheet.sheet_f_en)
                                    :   "--:--"
                                :   timeFromSeconds(sheet.sheet_p_en || 0)}
                            </div>
                            <div className={styles.hours}>
                                {timeFromSeconds(duration || 0)}
                            </div>
                        </>
                    );
                }

                return statusLabels[sheet.sheet_status] || null;
            }

            if (templateSheet) {
                const dateHasSheet = templateSheet?.idDateMap.map
                    .get(user.user_id)
                    ?.has(formatUTCDate(day));

                if (dateHasSheet && templateSheet) {
                    return (
                        <div
                            className={`${styles.schedule_cell} ${styles.new} ${styles.adding}`}
                            onClick={() => switchDateFn?.("delete", day, user)}
                        >
                            <InnerContent sheet={templateSheet} />
                        </div>
                    );
                }
            }

            const currentSheet =
                sheetsArray[user.user_id]?.[formatUTCDate(day)];

            if (currentSheet) {
                return (
                    <div
                        className={`${styles.schedule_cell} ${styles[currentSheet.sheet_status]} ${templateSheet ? styles.adding : ""} ${styles.old}`}
                        onClick={() =>
                            !templateSheet &&
                            handleSheetClick(currentSheet.sheet_id)
                        }
                        style={
                            currentSheet.sheet_status === "workday" ?
                                {
                                    backgroundColor:
                                        currentSheet.department_color,
                                }
                            :   {}
                        }
                    >
                        <InnerContent sheet={currentSheet} />
                    </div>
                );
            }

            return (
                <div
                    className={`${styles.schedule_cell} ${styles.empty} ${templateSheet ? styles.adding : ""}`}
                    onClick={() =>
                        templateSheet ?
                            switchDateFn?.("add", day, user)
                        :   handleSheetClick("0", "add", {
                                sheet_date: formatISODate(day),
                                user_id: user.user_id,
                            })
                    }
                ></div>
            );
        },
        [
            searchParams,
            handleSheetClick,
            templateSheet,
            switchDateFn,
            sheetsArray,
        ],
    );

    const RowTotalCell = useCallback(
        ({ user }: { user: IDBUser }) => {
            let count = 0;
            let total = 0;

            if (sheetsArray[user.user_id]) {
                const userSheets = sheetsArray[user.user_id];
                for (const date in userSheets) {
                    if (userSheets.hasOwnProperty(date)) {
                        const sheet = userSheets[date];
                        if (sheet.sheet_status === "workday") {
                            const isFactual = searchParams.factual === "true";
                            const duration =
                                isFactual ?
                                    sheet.sheet_total_dur
                                :   sheet.sheet_dur_p;
                            total += duration || 0;
                            count++;
                        }
                    }
                }
            }

            const templateUserDates = templateSheet?.idDateMap.map.get(
                user.user_id,
            );
            if (
                templateSheet?.sheet_status === "workday" &&
                templateUserDates
            ) {
                const isFactual = searchParams.factual === "true";
                const duration =
                    isFactual ?
                        templateSheet.sheet_total_dur
                    :   templateSheet.sheet_dur_p;
                total += templateUserDates.size * (duration || 0);
                count += templateUserDates.size;
            }

            return (
                <div className={styles.schedule_row_total}>
                    <div> {count}</div>
                    <div>{timeFromSeconds(total)}</div>
                </div>
            );
        },
        [searchParams, templateSheet, sheetsArray],
    );

    const ColumnTotalCell = useCallback(
        ({ day }: { day: Date }) => {
            if (templateSheet) return null;
            const daySheets = sheets.filter(
                (sheet) =>
                    sheet.sheet_date === formatISODate(day) &&
                    sheet.sheet_status === "workday",
            );

            return (
                <div className={styles.schedule_column_total}>
                    {daySheets.length}
                </div>
            );
        },
        [sheets, templateSheet],
    );

    return (
        <CalendarTable
            depts={depts}
            users={users}
            periodOptions={periodOptions}
            TableCell={ScheduleCalendarCell}
            RowTotalCell={RowTotalCell}
            RowTotalHeader={RowTotalHeader}
            ColumnTotalHeader={ColumnTotalHeader}
            ColumnTotalCell={ColumnTotalCell}
            columnWidths={columnWidths}
            placeholderText={
                templateSheet === null && isAdding ?
                    `Пожалуйста, настройте смену. После настройки — кликайте на ячейки.`
                :   undefined
            }
            isLoading={isLoading}
            useHeaderNavigation={templateSheet || isLoading ? false : true}
            monthBasis="day"
            navigationFn={after}
            searchParams={searchParams}
        />
    );
});

export default ScheduleBody;
