import { SearchParams } from "next/dist/server/request/search-params";
import PayslipFormAddParent from "../../_lib/form/PayslipFormAddParent";
import { paramArrayToString, validateSearchParam } from "@/app/functions/other";
import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import { redirect } from "next/navigation";

export type PayslipsAddParams = {
    startDate: string;
    endDate: string;
    uid?: string;
    auto: "true" | "false";
    backurl?: string;
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    const start = paramArrayToString(searchParamsRes.startDate);
    const end = paramArrayToString(searchParamsRes.endDate);

    const backurl = paramArrayToString(searchParamsRes.backurl);
    const uid = paramArrayToString(searchParamsRes.uid);

    const periodOptions = urlPeriodOptions(
        start,
        end,
        new Set(["custom", "month", "week"]),
    );

    const auto = validateSearchParam(searchParamsRes.auto, ["true", "false"]);

    if (
        periodOptions.start !== start ||
        periodOptions.end !== end ||
        !auto.valid
    ) {
        redirect(
            `/finance/payslips/add?${periodOptions.string}&auto=${auto.value}&uid=${
                uid
            }&backurl=${encodeURIComponent(backurl || "")}`,
        );
    }

    const validatedParams = {
        startDate: periodOptions.start,
        endDate: periodOptions.end,
        uid,
        auto: auto.value,
        backurl,
    };

    return (
        <PayslipFormAddParent
            searchParams={validatedParams}
            periodOptions={periodOptions}
        />
    );
}
