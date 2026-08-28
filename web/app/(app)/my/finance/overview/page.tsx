import { paramArrayToString, validateSearchParam } from "@/app/functions/other";
import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import { SearchParams } from "next/dist/server/request/search-params";
import { redirect } from "next/navigation";
import MyFinanceParent from "./_lib/page/MyFinanceParent";

export type MyFinanceSearchParams = {
    start: string;
    end: string;
    a: "active" | "archive" | "all";
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    const start = paramArrayToString(searchParamsRes.start);
    const end = paramArrayToString(searchParamsRes.end);

    const a = validateSearchParam(searchParamsRes.a, [
        "all",
        "active",
        "archive",
    ]);

    const isSearchParamsValid = start && end && a.valid;

    const periodOptions = urlPeriodOptions(
        start,
        end,
        new Set(["month", "week", "custom"]),
        "month",
    );

    if (
        !isSearchParamsValid ||
        periodOptions.start !== start ||
        periodOptions.end !== end
    ) {
        const periodString = periodOptions.string;
        const redirectURL = `/my/finance/overview?a=${a.value}&${periodString}`;
        redirect(redirectURL);
    }

    return (
        <MyFinanceParent
            searchParams={searchParamsRes as MyFinanceSearchParams}
        />
    );
}
