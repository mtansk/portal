import { paramArrayToString } from "@/app/functions/other";
import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import { SearchParams } from "next/dist/server/request/search-params";
import { redirect } from "next/navigation";
import MyPayslipsParent from "./_lib/page/MyPayslipsParent";

export type MyPayslipsSearchParams = {
    start: string;
    end: string;
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    const start = paramArrayToString(searchParamsRes.start);
    const end = paramArrayToString(searchParamsRes.end);

    const isSearchParamsValid = start && end;

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
        const redirectURL = `/my/finance/payslips?${periodString}`;
        redirect(redirectURL);
    }

    return (
        <MyPayslipsParent
            searchParams={searchParamsRes as MyPayslipsSearchParams}
        />
    );
}
