import {
    eachWeekOfInterval,
    endOfWeek,
    formatISO,
    getWeek,
    startOfWeek,
} from "date-fns";
import { numberPadStart } from "./other";
import { UTCDateMini } from "@date-fns/utc";

/* 

WEEKS

*/

export function getWeekNumber(date: Date): number {
    const _date = new UTCDateMini(date);

    return getWeek(_date, { weekStartsOn: 1, firstWeekContainsDate: 4 });
}

export function getWeekDates(date: Date) {
    const _date = new UTCDateMini(date);

    const monday = startOfWeek(_date, { weekStartsOn: 1 });
    const sunday = endOfWeek(_date, { weekStartsOn: 1 });

    return { monday, sunday };
}

export function getWeekInfo(date: Date) {
    const _date = new UTCDateMini(date);

    const weekNumber = getWeekNumber(_date);
    const { monday, sunday } = getWeekDates(_date);

    return { weekNumber, monday, sunday };
}

export type WeekWithDates = {
    monday: Date;
    sunday: Date;
    weekNumber: number;
};

export function getWeeksByMonth(year: number) {
    const array = [] as {
        month: number;
        weeks: WeekWithDates[];
    }[];
    for (let i = 0; i < 12; i++) {
        const weeks = eachWeekOfInterval(
            {
                start: new UTCDateMini(year, i, 1),
                end: new UTCDateMini(year, i, 31),
            },
            {
                weekStartsOn: 1,
            },
        );
        array.push({
            month: i,
            weeks: weeks.map((monday) => ({
                monday,
                sunday: endOfWeek(monday, { weekStartsOn: 1 }),
                weekNumber: getWeekNumber(monday),
            })),
        });
    }
    return array;
}

/* 




*/

export function formatISODate(date: Date | string): string {
    return formatISO(date, { representation: "date" });
}

export function formatUTCDate(inDate: Date | string): string {
    const date = new Date(inDate);
    const string = date.toISOString();
    return string.slice(0, string.indexOf("T"));
}

export function sqlTimestampToUTCDate(timestamp: string): Date {
    return new UTCDateMini(timestamp.replace(" ", "T") + "Z");
}

export function dateStringToUTCDate(dateStr: string): Date {
    return new UTCDateMini(dateStr + "T00:00:00Z");
}

export function timeFromSeconds(seconds: number, fullFormat?: boolean): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.abs(Math.floor((seconds % 3600) / 60));
    const secondsLeft = Math.abs(seconds % 60);

    return `${numberPadStart(hours)}:${numberPadStart(minutes)}${
        fullFormat ? `:${numberPadStart(secondsLeft)}` : ""
    }`;
}

export function secondsFromTime(time: string): number {
    const [hours, minutes] = time.split(":").map((x) => parseInt(x));

    return hours * 3600 + minutes * 60;
}

/* 





*/

export function getCurrentMonthRange(initialDate: string | Date): {
    startOfMonth: string;
    endOfMonth: string;
} {
    const date = new Date(initialDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    return {
        startOfMonth: formatISODate(startOfMonth),
        endOfMonth: formatISODate(endOfMonth),
    };
}

export function getNextMonthRange(initialDate: string | Date): {
    startOfMonth: string;
    endOfMonth: string;
} {
    const date = new Date(initialDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    const startOfNextMonth = new Date(year, month + 1, 1);
    const endOfNextMonth = new Date(year, month + 2, 0);

    return {
        startOfMonth: formatISODate(startOfNextMonth),
        endOfMonth: formatISODate(endOfNextMonth),
    };
}

export function getPreviousMonthRange(initialDate: string | Date): {
    startOfMonth: string;
    endOfMonth: string;
} {
    const date = new Date(initialDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    const startOfPreviousMonth = new Date(year, month - 1, 1);
    const endOfPreviousMonth = new Date(year, month, 0);

    return {
        startOfMonth: formatISODate(startOfPreviousMonth),
        endOfMonth: formatISODate(endOfPreviousMonth),
    };
}
