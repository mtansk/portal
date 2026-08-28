import { SearchParams } from "next/dist/server/request/search-params";
import DebtFormParent from "../../_lib/form/DebtFormParent";

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

    return (
        <DebtFormParent
            searchParams={searchParamsRes}
            id={id}
        />
    );
}
