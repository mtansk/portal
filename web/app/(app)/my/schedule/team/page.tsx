import { paramArrayToString } from "@/app/functions/other";
import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import { SearchParams } from "next/dist/server/request/search-params";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MyTeamScheduleParent from "./_lib/page/MyTeamScheduleParent";
import CalendarLoadingNew from "@/app/components/loading/calendar/CalendarLoadingNew";

export type TeamScheduleSearchParams = {
    start: string;
    end: string;
};

export const experimental_ppr = true;

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParams = await props.searchParams;

    const start = paramArrayToString(searchParams.start);
    const end = paramArrayToString(searchParams.end);

    const checkRequiredParams = start && end;

    const periodOptions = urlPeriodOptions(
        start,
        end,
        new Set(["week"]),
        "week",
    );

    if (
        !checkRequiredParams ||
        periodOptions.start !== start ||
        periodOptions.end !== end
    ) {
        const periodString = periodOptions.string;
        const redirectURL = `/my/schedule/team?${periodString}`;
        redirect(redirectURL);
    }

    return (
        <Suspense fallback={<CalendarLoadingNew />}>
            <MyTeamScheduleParent
                searchParams={searchParams as TeamScheduleSearchParams}
            />
        </Suspense>
    );
}
