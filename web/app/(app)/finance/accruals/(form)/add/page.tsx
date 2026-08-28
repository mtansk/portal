import { SearchParams } from "next/dist/server/request/search-params";

import { paramArrayToString } from "@/app/functions/other";
import AccrualFormAddParent from "../../_lib/form/AccrualsFormAddParent";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    return <AccrualFormAddParent searchParams={searchParamsRes} />;
}
