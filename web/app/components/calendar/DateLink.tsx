import { formatUTCDate } from "@/app/functions/dates";
import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
} from "date-fns";
import { SearchParams } from "next/dist/server/request/search-params";
import { Link } from "react-transition-progress/next";

export function hrefString(
    start: Date,
    end: Date,
    path: string,
    searchParams?: SearchParams,
) {
    if (searchParams) {
        const search = new URLSearchParams(searchParams as unknown as string);
        search.set("start", formatUTCDate(start));
        search.set("end", formatUTCDate(end));
        return path + "?" + search.toString();
    }
    return "";
}

export function DateLink({
    date,
    period,
    path,
    searchParams,

    clickFn,

    children,
}: {
    date: Date;
    period: "day" | "week" | "month" | "year";
    path: string;
    searchParams?: SearchParams;

    clickFn?: () => void;

    children: React.ReactNode;
}) {
    function getHref() {
        if (period === "day") {
            return hrefString(date, date, path, searchParams);
        } else if (period === "week") {
            return hrefString(
                startOfWeek(date, {
                    weekStartsOn: 1,
                }),
                endOfWeek(date, {
                    weekStartsOn: 1,
                }),
                path,
                searchParams,
            );
        } else if (period === "month") {
            return hrefString(
                startOfMonth(date),
                endOfMonth(date),
                path,
                searchParams,
            );
        } else if (period === "year") {
            return hrefString(
                startOfYear(date),
                endOfYear(date),
                path,
                searchParams,
            );
        }
    }

    return (
        <Link
            href={getHref() || ""}
            prefetch={false}
            onClick={clickFn}
        >
            {children}
        </Link>
    );
}
