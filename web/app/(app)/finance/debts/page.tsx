import { SearchParams } from "next/dist/server/request/search-params";
import { paramArrayToString, validateSearchParam } from "@/app/functions/other";
import { redirect } from "next/navigation";
import DebtsParent from "./_lib/page/DebtsParent";
import DebtsHeader from "./_lib/page/DebtsHeader";

export type DebtsSearchParams = {
    settled: "true" | "false";
    uid: string;
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    const uid = paramArrayToString(searchParamsRes.uid);
    const showSettled = validateSearchParam(searchParamsRes.settled, [
        "true",
        "false",
    ]);

    if (!showSettled.valid) {
        redirect(`/finance/debts?settled=${showSettled.value}&uid=${uid}`);
    }

    return (
        <>
            <DebtsHeader searchParams={searchParamsRes as DebtsSearchParams} />
            <DebtsParent searchParams={searchParamsRes as DebtsSearchParams} />
        </>
    );
}
