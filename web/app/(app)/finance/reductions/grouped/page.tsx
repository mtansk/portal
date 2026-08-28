import ReductionsParent from "../_lib/page/ReductionsParent";
import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";
import { FinanceHeaderPageType } from "../../_lib/other/FinanceHeader";
import { SearchParams } from "next/dist/server/request/search-params";
import { efoParamsHandler } from "../../_lib/functions";
import { Suspense } from "react";
import FinanceBodyLoading from "../../_lib/efo-body/components/FinanceBodyLoading";
import ReductionsHeader from "../_lib/page/ReductionsHeader";
import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";

const pageType: FinanceHeaderPageType = {
    object: "reductions",
    page: "grouped",
};

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
}) {
    const { searchParams, periodOptions } = await efoParamsHandler(
        props.searchParams,
        pageType,
    );

    const depts = getDepts({});
    const users = getUsers({});

    return (
        <>
            <ReductionsHeader
                depts={depts}
                users={users}
                page="grouped"
                searchParams={searchParams as FinanceSearchParams}
            />
            <Suspense fallback={<FinanceBodyLoading />}>
                <ReductionsParent
                    searchParams={searchParams as FinanceSearchParams}
                    periodOptions={periodOptions}
                    type="grouped"
                />
            </Suspense>
        </>
    );
}
