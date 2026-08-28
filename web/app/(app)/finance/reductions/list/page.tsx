import ReductionsParent from "../_lib/page/ReductionsParent";
import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";
import { efoParamsHandler } from "../../_lib/functions";
import FinanceBodyLoading from "../../_lib/efo-body/components/FinanceBodyLoading";
import { FinanceHeaderPageType } from "../../_lib/other/FinanceHeader";
import ReductionsHeader from "../_lib/page/ReductionsHeader";
import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";

export const experimental_ppr = true;

const pageType: FinanceHeaderPageType = {
    object: "reductions",
    page: "list",
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    /*     const searchParamsRes1 = await searchParams;

    return <div>123</div>; */

    const { searchParams: searchParamsRes, periodOptions } =
        await efoParamsHandler(searchParams, pageType);

    const depts = getDepts({});
    const users = getUsers({});

    return (
        <>
            <ReductionsHeader
                depts={depts}
                users={users}
                page="list"
                searchParams={searchParamsRes as FinanceSearchParams}
            />
            <Suspense fallback={<FinanceBodyLoading />}>
                <ReductionsParent
                    searchParams={searchParamsRes as FinanceSearchParams}
                    periodOptions={periodOptions}
                    type="list"
                />
            </Suspense>
        </>
    );
}
