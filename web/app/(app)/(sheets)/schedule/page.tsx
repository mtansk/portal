import "server-only";

import { Suspense } from "react";
import ScheduleParent from "./_lib/ScheduleParent";
import { redirect } from "next/navigation";
import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import { paramArrayToString } from "@/app/functions/other";
import { SearchParams } from "next/dist/server/request/search-params";
import CalendarLoadingNew from "@/app/components/loading/calendar/CalendarLoadingNew";

export type ScheduleSearchParams = {
    start: string;
    end: string;
    filter: string;
    factual: string;
};

export const experimental_ppr = true;

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParams = await props.searchParams;

    const start = paramArrayToString(searchParams.start);
    const end = paramArrayToString(searchParams.end);
    const filter = paramArrayToString(searchParams.filter);
    const factual = paramArrayToString(searchParams.factual);

    const checkRequiredParams = start && end && filter && factual;

    const validFilter = () => {
        if (filter) {
            return filter;
        } else {
            return "0";
        }
    };

    const validFactual = () => {
        if (factual === "true") {
            return "true";
        } else {
            return "false";
        }
    };

    const validParams = (factual === "true" || factual === "false") && filter;
    const periodOptions = urlPeriodOptions(
        start,
        end,
        new Set(["month", "week"]),
        "month",
    );

    if (
        !checkRequiredParams ||
        periodOptions.start !== start ||
        periodOptions.end !== end ||
        !validParams
    ) {
        const periodString = periodOptions.string;
        const redirectURL = `/schedule?filter=${validFilter()}&factual=${validFactual()}&${periodString}`;
        redirect(redirectURL);
    }

    return (
        <>
            <Suspense fallback={<CalendarLoadingNew />}>
                <ScheduleParent
                    periodOptions={periodOptions}
                    searchParams={searchParams as ScheduleSearchParams}
                />
            </Suspense>
        </>
    );
}
