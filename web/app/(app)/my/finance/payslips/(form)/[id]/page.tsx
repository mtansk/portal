import { paramArrayToString } from "@/app/functions/other";
import { SearchParams } from "next/dist/server/request/search-params";
import MyPayslipFormParent from "../../_lib/form/MyPayslipFormParent";

export default async function page({
    searchParams,
    params,
}: {
    searchParams: Promise<SearchParams>;
    params: Promise<{
        id: string;
    }>;
}) {
    const searchParamsRes = await searchParams;
    const paramsRes = await params;
    /* 
    const backurl = paramArrayToString(searchParamsRes.backurl); */

    const id = paramsRes.id;

    return (
        <MyPayslipFormParent
            id={id}
            searchParams={searchParamsRes}
        />
    );
}
