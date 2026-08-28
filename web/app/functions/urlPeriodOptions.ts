import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isMonday,
    isSameDay,
    isFirstDayOfMonth,
    differenceInCalendarDays,
    startOfYear,
    endOfYear,
} from "date-fns";
import { formatISODate } from "./dates";
import { UTCDateMini } from "@date-fns/utc";

export type PeriodTypes = "year" | "month" | "week" | "custom";

export type PeriodOptions = {
    start: string;
    end: string;
    string: string;
    period: PeriodTypes;
    allowedPeriods: Set<PeriodTypes>;
};

export function urlPeriodOptions(
    start: string | null | undefined,
    end: string | null | undefined,
    allowedPeriods: Set<PeriodTypes>,
    defaultPeriod: PeriodTypes = "month",
): PeriodOptions {
    if (!start || !end) return getDefaultString();

    if (!isValidDateRange(start, end)) return getDefaultString();

    const startDate = new UTCDateMini(start);
    const endDate = new UTCDateMini(end);

    switch (calculatePeriodType(startDate, endDate)) {
        case "year": {
            if (allowedPeriods.has("year")) {
                return getPeriodString(start, end, "year");
            }
            break;
        }
        case "month": {
            if (allowedPeriods.has("month")) {
                return getPeriodString(start, end, "month");
            }
            break;
        }
        case "week": {
            if (allowedPeriods.has("week")) {
                return getPeriodString(start, end, "week");
            }
            break;
        }
        case "custom": {
            if (allowedPeriods.has("custom")) {
                if (differenceInCalendarDays(end, start) < 91) {
                    return getPeriodString(start, end, "custom");
                }
            }
            break;
        }
    }
    return getDefaultString();

    function getPeriodString(
        start: string,
        end: string,
        period: PeriodTypes = "custom",
    ) {
        return {
            start,
            end,
            string: `start=${start}&end=${end}`,
            period,
            allowedPeriods,
        };
    }

    function isValidDateRange(start: string, end: string): boolean {
        const regExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!regExp.test(start) || !regExp.test(end)) return false;

        const startDate = new UTCDateMini(start);
        const endDate = new UTCDateMini(end);
        return startDate <= endDate;
    }

    function getDefaultString() {
        const now = new Date();
        if (defaultPeriod === "week") {
            const start = startOfWeek(now, { weekStartsOn: 1 });
            const end = endOfWeek(start, { weekStartsOn: 1 });

            return getPeriodString(
                formatISODate(start),
                formatISODate(end),
                "week",
            );
        } else {
            const start = startOfMonth(now);
            const end = endOfMonth(start);

            return getPeriodString(
                formatISODate(start),
                formatISODate(end),
                "month",
            );
        }
    }

    function calculatePeriodType(startDate: Date, endDate: Date): PeriodTypes {
        if (
            isMonday(startDate) &&
            isSameDay(
                endOfWeek(startDate, {
                    weekStartsOn: 1,
                }),
                endDate,
            )
        ) {
            return "week";
        }

        if (
            isFirstDayOfMonth(startDate) &&
            isSameDay(endOfMonth(startDate), endDate)
        ) {
            return "month";
        }

        if (
            isSameDay(startOfYear(startDate), startDate) &&
            isSameDay(endOfYear(startDate), endDate)
        ) {
            return "year";
        }

        return "custom";
    }
}
