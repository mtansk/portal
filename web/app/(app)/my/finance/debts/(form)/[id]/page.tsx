import { SearchParams } from "next/dist/server/request/search-params";
import MyDebtFormParent from "../../_lib/form/MyDebtFormParent";

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

    const id = paramsRes.id;

    return <MyDebtFormParent id={id} />;
}
