import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import { paramArrayToString, validateSearchParam } from "@/app/functions/other";
import { SearchParams } from "next/dist/server/request/search-params";
import { redirect } from "next/navigation";
import FinanceCalendarParent from "./_lib/FinanceCalendarParent";

export type FinanceCalendarSearchParams = {
    start: string;
    end: string;
    object: "accruals" | "reductions" | "payments";
    sum: "all" | "arc" | "act";
    dept: string;
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    const start = paramArrayToString(searchParamsRes.start);
    const end = paramArrayToString(searchParamsRes.end);

    const periodOptions = urlPeriodOptions(
        start,
        end,
        new Set(["week", "year", "month"]),
        "week",
    );

    const object = validateSearchParam(searchParamsRes.object, [
        "accruals",
        "reductions",
        "payments",
    ]);
    const sum = validateSearchParam(searchParamsRes.sum, ["all", "arc", "act"]);
    const dept = validateSearchParam(searchParamsRes.dept);

    if (!object.valid || !sum.valid || !dept.valid) {
        const url = `/finance-calendar?object=${object.value}&sum=${sum.value}&dept=${dept.value || 0}&${periodOptions.string}`;
        redirect(url);
    }

    return (
        <FinanceCalendarParent
            searchParams={searchParamsRes as FinanceCalendarSearchParams}
            periodOptions={periodOptions}
        />
    );
}
