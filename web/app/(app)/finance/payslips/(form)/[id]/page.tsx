import { SearchParams } from "next/dist/server/request/search-params";
import PayslipFormParent from "../../_lib/form/PayslipFormParent";

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
        <PayslipFormParent
            id={id}
            searchParams={searchParamsRes}
        />
    );
}
