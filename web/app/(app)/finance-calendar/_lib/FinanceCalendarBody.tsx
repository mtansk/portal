import CalendarTable from "@/app/components/calendar/CalendarTable";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { ApiDept } from "@/app/types/depts/Depts";
import {
    EfoDailyTotals,
    EfoMonthlyTotals,
    EfoTotals,
    EfoWeeklyTotals,
} from "@/app/types/finance/other/Totals";
import { ApiUser } from "@/app/types/user/Users";
import { FinanceCalendarSearchParams } from "../page";
import { formatUTCDate, getWeekNumber } from "@/app/functions/dates";
import { Formatter } from "@/app/classes/Formatter";

import styles from "./css/total-cell.module.scss";
import { memo, useCallback, useLayoutEffect } from "react";
import { parseFloatAny } from "@/app/functions/other";

import Reduction from "@/app/classes/finance/Reduction";
import Payment from "@/app/classes/finance/Payment";
import Accrual from "@/app/classes/finance/Accrual";

const columnWidths = {
    body: "7rem",
    rowTotal: "7rem",
};

function RowTotalHeader() {
    return <div>Сумма</div>;
}

function ColumnTotalHeader() {
    return <div>Сумма</div>;
}

function getTotalValue(
    total: EfoTotals | undefined,
    sum: "all" | "arc" | "act",
) {
    if (sum === "all") {
        return total?.total;
    } else if (sum === "arc") {
        return total?.archive_total;
    } else if (sum === "act") {
        return total?.active_total;
    }
}
function isDailyTotal(total: EfoTotals): total is EfoDailyTotals {
    if ("date" in total) {
        return true;
    }
    return false;
}

function isMonthlyTotal(total: EfoTotals): total is EfoMonthlyTotals {
    if ("month" in total) {
        return true;
    }
    return false;
}

function isWeeklyTotal(total: EfoTotals): total is EfoWeeklyTotals {
    if ("week" in total) {
        return true;
    }
    return false;
}

export const FinanceCalendarBody = memo(function FinanceCalendarBody({
    arrayOfTotals,

    depts,
    users,

    periodOptions,
    searchParams,

    templateObject,
    switchDateFn,

    isAdding,
    isLoading,
    navigationFn,
}: {
    arrayOfTotals: EfoTotals[];

    depts: ApiDept[];
    users: ApiUser[];

    periodOptions: PeriodOptions;
    searchParams: FinanceCalendarSearchParams;

    templateObject: Accrual | Reduction | Payment | null;
    switchDateFn?: (day: Date, user: ApiUser) => void;

    isAdding: boolean;
    isLoading?: boolean;
    navigationFn?: () => void;
}) {
    const TableCell = useCallback(
        ({ day, user }: { day: Date; user: ApiUser }) => {
            if (periodOptions.period === "week" && templateObject) {
                const hasTotal = templateObject.idDateMap.map
                    .get(user.user_id)
                    ?.has(formatUTCDate(day));

                return (
                    <div
                        className={`${styles.total_cell} ${styles.add}  ${hasTotal ? styles.new : styles.old}`}
                        onClick={() => {
                            switchDateFn?.(day, user);
                        }}
                    >
                        <div className={styles.inner}>
                            {hasTotal &&
                                Formatter.floatString(templateObject.total)}
                        </div>
                    </div>
                );
            }

            const total = arrayOfTotals.find((total) => {
                if (periodOptions.period === "week" && isDailyTotal(total)) {
                    return (
                        total.date === formatUTCDate(day) &&
                        total.user_id === user.user_id
                    );
                } else if (
                    periodOptions.period === "year" &&
                    isMonthlyTotal(total)
                ) {
                    return (
                        total.month === day.getUTCMonth() + 1 &&
                        total.user_id === user.user_id
                    );
                } else if (
                    periodOptions.period === "month" &&
                    isWeeklyTotal(total)
                ) {
                    return (
                        total.user_id === user.user_id &&
                        total.week === getWeekNumber(day) &&
                        total.year === day.getUTCFullYear()
                    );
                }
            });

            const value = parseFloat(
                getTotalValue(total, searchParams.sum) || "",
            );

            if (value && total) {
                return (
                    <div
                        className={`${styles.total_cell} ${styles[searchParams.object]}`}
                        title={Formatter.floatString(total.total)}
                    >
                        <div className={styles.inner}>
                            {Formatter.floatString(value)}
                        </div>
                    </div>
                );
            }
        },
        [
            arrayOfTotals,
            periodOptions,
            searchParams,
            templateObject,
            switchDateFn,
        ],
    );

    const RowTotalCell = useCallback(
        ({ user }: { user: ApiUser }) => {
            function getUserTotal() {
                if (templateObject) {
                    if (!templateObject) return;

                    return (
                        (templateObject.idDateMap.map.get(user.user_id)?.size ||
                            0) * templateObject.total
                    );
                }

                const userTotals = arrayOfTotals.filter(
                    (total) => total.user_id === user.user_id,
                );

                return userTotals.reduce((acc, total) => {
                    return (
                        parseFloatAny(acc) +
                        parseFloatAny(
                            getTotalValue(total, searchParams.sum) || 0,
                        )
                    );
                }, 0);
            }

            const total = getUserTotal();

            return (
                <div className={styles.row_total}>
                    <div className={styles.inner}>
                        {Formatter.currencyString({ value: total })}
                    </div>
                </div>
            );
        },
        [arrayOfTotals, searchParams, templateObject],
    );

    const ColumnTotalCell = useCallback(
        ({ day }: { day: Date }) => {
            function getTotal() {
                if (templateObject) {
                    if (!templateObject) return;

                    const count = Array.from(
                        templateObject?.idDateMap.map.values(),
                    ).reduce(
                        (count, dateSet) =>
                            count + (dateSet.has(formatUTCDate(day)) ? 1 : 0),
                        0,
                    );

                    return count * templateObject.total;
                }

                const dateTotals = arrayOfTotals.filter((total) => {
                    if (
                        searchParams.dept !== "0" &&
                        total.department_id.toString() !== searchParams.dept
                    ) {
                        return;
                    }

                    if (
                        periodOptions.period === "week" &&
                        isDailyTotal(total)
                    ) {
                        return total.date === formatUTCDate(day);
                    } else if (
                        periodOptions.period === "year" &&
                        isMonthlyTotal(total)
                    ) {
                        return total.month === day.getUTCMonth() + 1;
                    } else if (
                        periodOptions.period === "month" &&
                        isWeeklyTotal(total)
                    ) {
                        return (
                            total.week === getWeekNumber(day) &&
                            total.year === day.getUTCFullYear()
                        );
                    }
                });

                return dateTotals.reduce((acc, total) => {
                    return (
                        parseFloatAny(acc) +
                        parseFloatAny(
                            getTotalValue(total, searchParams.sum) || 0,
                        )
                    );
                }, 0);
            }

            const total = getTotal();

            return (
                <div className={styles.column_total}>
                    <div className={styles.inner}>
                        {Formatter.floatString(total)}
                    </div>
                </div>
            );
        },
        [arrayOfTotals, periodOptions, searchParams, templateObject],
    );

    return (
        <>
            <CalendarTable
                periodOptions={periodOptions}
                monthBasis="week"
                depts={depts}
                users={users}
                TableCell={TableCell}
                RowTotalHeader={RowTotalHeader}
                RowTotalCell={RowTotalCell}
                ColumnTotalHeader={ColumnTotalHeader}
                ColumnTotalCell={ColumnTotalCell}
                columnWidths={columnWidths}
                isLoading={isLoading}
                placeholderText={
                    templateObject === null && isAdding ?
                        "Пожалуйста, настройте объект"
                    :   undefined
                }
                searchParams={searchParams}
                useHeaderNavigation={templateObject || isLoading ? false : true}
                navigationFn={navigationFn}
            />
        </>
    );
});

function TableCell({
    day,
    user,
    periodOptions,
    templateObject,
    arrayOfTotals,
    searchParams,
    switchDateFn,
}: {
    day: Date;
    user: ApiUser;
    periodOptions: PeriodOptions;
    templateObject: Accrual | Reduction | Payment | null;
    arrayOfTotals: EfoTotals[];

    searchParams: FinanceCalendarSearchParams;

    switchDateFn?: (day: Date, user: ApiUser) => void;
}) {
    if (periodOptions.period === "week" && templateObject) {
        const hasTotal = templateObject.idDateMap.map
            .get(user.user_id)
            ?.has(formatUTCDate(day));

        return (
            <div
                className={`${styles.total_cell} ${styles.add}  ${hasTotal ? styles.new : styles.old}`}
                onClick={() => {
                    switchDateFn?.(day, user);
                }}
            >
                <div className={styles.inner}>
                    {hasTotal && Formatter.floatString(templateObject.total)}
                </div>
            </div>
        );
    }

    const total = arrayOfTotals.find((total) => {
        if (periodOptions.period === "week" && isDailyTotal(total)) {
            return (
                total.date === formatUTCDate(day) &&
                total.user_id === user.user_id
            );
        } else if (periodOptions.period === "year" && isMonthlyTotal(total)) {
            return (
                total.month === day.getUTCMonth() + 1 &&
                total.user_id === user.user_id
            );
        } else if (periodOptions.period === "month" && isWeeklyTotal(total)) {
            return (
                total.user_id === user.user_id &&
                total.week === getWeekNumber(day) &&
                total.year === day.getUTCFullYear()
            );
        }
    });

    const value = parseFloat(getTotalValue(total, searchParams.sum) || "");

    if (value && total) {
        return (
            <div
                className={`${styles.total_cell} ${styles[searchParams.object]}`}
                title={Formatter.floatString(total.total)}
            >
                <div className={styles.inner}>
                    {Formatter.floatString(value)}
                </div>
            </div>
        );
    }
}
