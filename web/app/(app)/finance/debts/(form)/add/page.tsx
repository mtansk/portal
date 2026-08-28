import { SearchParams } from "next/dist/server/request/search-params";
import DebtFormAddParent from "../../_lib/form/DebtFormAddParent";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    return <DebtFormAddParent searchParams={searchParamsRes} />;
}
