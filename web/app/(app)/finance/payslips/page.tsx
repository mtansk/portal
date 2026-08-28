import { SearchParams } from "next/dist/server/request/search-params";
import PayslipsParent from "./_lib/page/PayslipsParent";
import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import { paramArrayToString } from "@/app/functions/other";
import { redirect } from "next/navigation";

export type PayslipsSearchParams = {
    start: string;
    end: string;
    uid: string;
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    const start = paramArrayToString(searchParamsRes.start);
    const end = paramArrayToString(searchParamsRes.end);

    const uid = paramArrayToString(searchParamsRes.uid);

    const periodOptions = urlPeriodOptions(
        start,
        end,
        new Set(["week", "month", "custom"]),
        "month",
    );

    if (start !== periodOptions.start || end !== periodOptions.end) {
        redirect(
            `/finance/payslips?start=${periodOptions.start}&end=${periodOptions.end}&uid=${uid}`,
        );
    }

    return (
        <PayslipsParent
            periodOptions={periodOptions}
            searchParams={searchParamsRes as PayslipsSearchParams}
        />
    );
}
