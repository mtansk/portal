import {
    isSameDay,
    isThisMonth,
    isThisWeek,
    isToday,
    isWeekend,
    subDays,
} from "date-fns";

import styles from "./css/calendar-header.module.scss";

import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { memo } from "react";
import { getWeekNumber, getWeeksByMonth } from "@/app/functions/dates";
import { SearchParams } from "next/dist/server/request/search-params";
import { usePathname } from "next/navigation";
import { UTCDateMini } from "@date-fns/utc";
import { DateLink } from "./DateLink";

export const CalendarHeader = memo(function CalendarHeader({
    periodOptions,
    monthBasis = "day",

    RowTotalHeader,
    intervalDates,

    searchParams,
    useHeaderNavigation,
    navigationFn,
}: {
    periodOptions: PeriodOptions;
    monthBasis?: "day" | "week";

    RowTotalHeader: (() => React.ReactNode) | undefined;
    intervalDates: Date[];

    searchParams?: SearchParams;
    useHeaderNavigation?: boolean;
    navigationFn?: () => void;
}) {
    const path = usePathname();

    const weeksMap = new Map<number, Date[]>();
    const monthMap = new Map<number, Date[]>();

    intervalDates.forEach((date) => {
        const weekNumber = getWeekNumber(date);
        weeksMap.set(weekNumber, [...(weeksMap.get(weekNumber) || []), date]);

        const monthNumber = date.getMonth();
        monthMap.set(monthNumber, [...(monthMap.get(monthNumber) || []), date]);
    });

    function InnerDateRowContent({ date, i }: { date: Date; i: number }) {
        const getDateRange = (startDate: Date, endDate: Date) =>
            `${startDate.getUTCDate()}-${endDate.getUTCDate()}`;

        if (
            periodOptions.period === "week" ||
            (periodOptions.period === "month" && monthBasis === "day")
        ) {
            return date.getDate();
        }

        if (periodOptions.period === "month" && monthBasis === "week") {
            const firstDayOfPeriod = new UTCDateMini(periodOptions.start);
            const lastDayOfPeriod = new UTCDateMini(periodOptions.end);
            const firstIntervalDay = subDays(intervalDates[1], 1);

            if (i === 0) {
                return isSameDay(firstDayOfPeriod, firstIntervalDay) ?
                        new UTCDateMini(periodOptions.start).getUTCDate()
                    :   getDateRange(
                            new UTCDateMini(periodOptions.start),
                            firstIntervalDay,
                        );
            }

            if (i === intervalDates.length - 1) {
                return (
                        isSameDay(
                            lastDayOfPeriod,
                            intervalDates[intervalDates.length - 1],
                        )
                    ) ?
                        intervalDates[intervalDates.length - 1].getUTCDate()
                    :   getDateRange(
                            intervalDates[intervalDates.length - 1],
                            new UTCDateMini(periodOptions.end),
                        );
            }

            return getDateRange(
                intervalDates[i],
                subDays(intervalDates[i + 1], 1),
            );
        }

        if (periodOptions.period === "year") {
            const monthName = Intl.DateTimeFormat("ru", {
                month: "long",
                timeZone: "UTC",
            }).format(date);
            return (
                    useHeaderNavigation &&
                        periodOptions.allowedPeriods.has("month")
                ) ?
                    <DateLink
                        path={path}
                        searchParams={searchParams}
                        clickFn={navigationFn}
                        date={date}
                        period="month"
                    >
                        {monthName}
                    </DateLink>
                :   monthName;
        }
    }

    const weeksByMonth =
        periodOptions.period === "year" ?
            getWeeksByMonth(new Date(periodOptions.start).getFullYear())
        :   null;

    const headerClassname = () => {
        if (periodOptions.period === "month") {
            return monthBasis === "day" ? "" : "no_weekday";
        }

        if (periodOptions.period === "year") {
            return "no_weekday";
        }

        if (periodOptions.period === "week") {
            return "no_weeknumber";
        }

        return "";
    };

    return (
        <div className={styles.header + " " + styles[headerClassname()]}>
            <div className={styles.upper_label}>
                {periodOptions.period === "month" && "Неделя"}
                {periodOptions.period === "year" && "Недели"}
            </div>
            <div className={styles.lower_label}>
                {periodOptions.period === "year" ? "Месяц" : "Даты"}
            </div>

            <div className={styles.week_number_row}>
                <div className={styles.weeks_div}>
                    {Array.from(weeksMap).map(([weekNumber, dates]) => {
                        return (
                            <div
                                key={`weekKey${weekNumber}`}
                                style={{
                                    gridColumn: "span " + dates.length,
                                }}
                                className={styles.week}
                            >
                                {periodOptions.period === "month" &&
                                    ((
                                        useHeaderNavigation &&
                                        periodOptions.allowedPeriods.has("week")
                                    ) ?
                                        <>
                                            <DateLink
                                                path={path}
                                                searchParams={searchParams}
                                                clickFn={navigationFn}
                                                date={dates[0]}
                                                period="week"
                                            >
                                                {weekNumber}
                                            </DateLink>
                                        </>
                                    :   <>{weekNumber}</>)}
                                {periodOptions.period === "year" && (
                                    <>
                                        {weeksByMonth![dates[0].getMonth()]
                                            .weeks[0].weekNumber +
                                            "-" +
                                            weeksByMonth![dates[0].getMonth()]
                                                .weeks[
                                                weeksByMonth![
                                                    dates[0].getMonth()
                                                ].weeks.length - 1
                                            ].weekNumber}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.weekday_row}>
                {intervalDates.map((date, i) => {
                    return (
                        <div
                            key={`weekdayKey${i}`}
                            className={
                                styles.weekday +
                                " " +
                                (isWeekend(date) ? styles.weekend : "")
                            }
                        >
                            {(periodOptions.period === "week" ||
                                (periodOptions.period === "month" &&
                                    monthBasis === "day")) &&
                                Intl.DateTimeFormat("ru", {
                                    weekday: "short",
                                }).format(date)}
                        </div>
                    );
                })}
            </div>

            <div className={styles.date_row}>
                {intervalDates.map((date, i) => {
                    return (
                        <div
                            className={styles.date_holder}
                            key={`dateKey${i}`}
                        >
                            <div
                                className={`${styles.date} ${
                                    (
                                        isToday(date.toString()) ||
                                        (periodOptions.period === "month" &&
                                            monthBasis === "week" &&
                                            isThisWeek(date)) ||
                                        (periodOptions.period === "year" &&
                                            isThisMonth(
                                                date /* .toLocaleDateString(), */, // проблема
                                            ))
                                    ) ?
                                        styles.today
                                    :   ""
                                }`}
                            >
                                <InnerDateRowContent
                                    date={date}
                                    i={i}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {RowTotalHeader && (
                <div className={styles.row_total_header}>
                    <RowTotalHeader />
                </div>
            )}
        </div>
    );
});
