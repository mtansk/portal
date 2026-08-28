import { memo, useMemo } from "react";

import styles from "./css/calendar-container.module.scss";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import { endOfMonth, isSunday, startOfMonth, subDays } from "date-fns";
import { formatUTCDate } from "@/app/functions/dates";
import smartSorting from "@/app/functions/smartSorting";

function getIntervalEdges(
    day: Date,
    i: number,
    periodOptions: PeriodOptions,
    intervalDates: Date[],
    monthBasis: "day" | "week",
) {
    if (
        (periodOptions.period === "month" && monthBasis === "day") ||
        periodOptions.period === "week"
    ) {
        return { start: formatUTCDate(day), end: formatUTCDate(day) };
    }

    if (periodOptions.period === "month" && monthBasis === "week") {
        if (i === 0) {
            return {
                start: formatUTCDate(startOfMonth(intervalDates[1])),
                end: formatUTCDate(subDays(intervalDates[1], 1)),
            };
        } else if (i === intervalDates.length - 1) {
            return {
                start: formatUTCDate(day),
                end: formatUTCDate(endOfMonth(day)),
            };
        } else {
            return {
                start: formatUTCDate(day),
                end: formatUTCDate(subDays(intervalDates[i + 1], 1)),
            };
        }
    }

    if (periodOptions.period === "year") {
        return {
            start: formatUTCDate(startOfMonth(day)),
            end: formatUTCDate(endOfMonth(day)),
        };
    }
}

export const CalendarBodyContent = memo(function CalendarBodyContent({
    depts,
    users,
    intervalDates,

    periodOptions,

    RowTotalCell,
    ColumnTotalCell,

    ColumnTotalHeader,

    TableCell,
}: {
    depts: ApiDept[];
    users: ApiUser[];
    intervalDates: Date[];

    periodOptions: PeriodOptions;

    RowTotalCell?: ({ user }: { user: ApiUser }) => React.ReactNode;
    ColumnTotalCell?: ({ day }: { day: Date }) => React.ReactNode;

    ColumnTotalHeader?: () => React.ReactNode;

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
}) {
    const sortedUsers = useMemo(
        () =>
            smartSorting(users, {
                col: "last_name",
                order: "ASC",
            }),
        [users],
    );

    let mainBody = [];

    for (let d = 0; d < depts.length; d++) {
        let dept = depts[d];
        let deptDiv = [];
        let deptUsers = sortedUsers.filter(
            (user) => user.department_id === dept.department_id,
        );

        if (deptUsers.length === 0) {
            continue;
        }

        for (let u = 0; u < deptUsers.length; u++) {
            let user = deptUsers[u];
            let userRow = [];

            for (let i = 0; i < intervalDates.length; i++) {
                let day = intervalDates[i];
                let cell = (
                    <div
                        className={`${styles.calendar_table_cell} ${
                            periodOptions.period !== "year" && isSunday(day) ?
                                styles.sunday
                            :   ""
                        }`}
                        key={`${user.user_id}/${day.getDate()}/${day.getMonth()}`}
                    >
                        <div className={styles.rounded_holder}>
                            <TableCell
                                day={day}
                                user={user}
                                period={getIntervalEdges(
                                    day,
                                    i,
                                    periodOptions,
                                    intervalDates,
                                    "day",
                                )}
                            />
                        </div>
                    </div>
                );
                userRow.push(cell);
            }
            if (RowTotalCell) {
                userRow.push(
                    <div
                        className={styles.row_total_cell}
                        key={`rowTotal${user.user_id}`}
                    >
                        <RowTotalCell user={user} />
                    </div>,
                );
            }
            deptDiv.push(
                <div
                    className={styles.user_row}
                    key={`${dept.department_id}/${user.user_id}`}
                >
                    <div
                        key={user.user_id}
                        className={styles.name_div}
                        title={`${user.last_name || ""} ${user.first_name} ${user.middle_name || ""} - ${user.user_title}${user.deleted_at ? ". Удален" : ""}`}
                    >
                        <div className={styles.name}>
                            {`${user.last_name || ""} ${user.first_name}`}
                        </div>
                        <div className={styles.title}>{user.user_title}</div>
                        {user.deleted_at && (
                            <div className={"icon " + styles.deleted_icon}>
                                delete
                            </div>
                        )}
                    </div>
                    {userRow}
                </div>,
            );
        }
        mainBody.push(
            <div
                className={styles.dept_div}
                key={`deptKey${dept.department_id}`}
            >
                <div className={styles.department_name}>
                    {dept.department_name}
                </div>
                <div
                    style={{
                        gridColumn: `span ${intervalDates.length + (RowTotalCell ? 1 : 0)}`,
                    }}
                ></div>
                {deptDiv}
            </div>,
        );
    }

    return (
        <>
            {mainBody}
            {ColumnTotalHeader && (
                <div className={styles.column_total_header}>
                    <ColumnTotalHeader />
                </div>
            )}

            {intervalDates.map((day) => {
                return (
                    <div
                        className={styles.column_total_cell}
                        key={`columnTotal${day.getTime()}`}
                    >
                        {ColumnTotalCell && <ColumnTotalCell day={day} />}
                    </div>
                );
            })}
        </>
    );
});
