import { paramArrayToString } from "@/app/functions/other";
import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import { SearchParams } from "next/dist/server/request/search-params";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MyScheduleParent from "./_lib/page/MyScheduleParent";
import CalendarLoadingNew from "@/app/components/loading/calendar/CalendarLoadingNew";

export type MyScheduleSearchParams = {
    start: string;
    end: string;
    factual: string;
};

export const experimental_ppr = true;

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParams = await props.searchParams;

    const start = paramArrayToString(searchParams.start);
    const end = paramArrayToString(searchParams.end);
    const factual = paramArrayToString(searchParams.factual);

    const checkRequiredParams = start && end && factual;

    const validFactual = () => {
        if (factual === "true") {
            return "true";
        } else {
            return "false";
        }
    };

    const validParams = factual === "true" || factual === "false";
    const periodOptions = urlPeriodOptions(
        start,
        end,
        new Set(["month"]),
        "month",
    );

    if (
        !checkRequiredParams ||
        periodOptions.start !== start ||
        periodOptions.end !== end ||
        !validParams
    ) {
        const periodString = periodOptions.string;
        const redirectURL = `/my/schedule/my?factual=${validFactual()}&${periodString}`;
        redirect(redirectURL);
    }

    return (
        <Suspense fallback={<CalendarLoadingNew />}>
            <MyScheduleParent
                searchParams={searchParams as MyScheduleSearchParams}
            />
        </Suspense>
    );
}
