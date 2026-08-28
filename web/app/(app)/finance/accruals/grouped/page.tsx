import { FinanceHeaderPageType } from "../../_lib/other/FinanceHeader";
import { Suspense } from "react";
import FinanceBodyLoading from "../../_lib/efo-body/components/FinanceBodyLoading";
import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";
import { SearchParams } from "next/dist/server/request/search-params";
import { efoParamsHandler } from "../../_lib/functions";
import dynamic from "next/dynamic";
import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";
import AccrualsHeader from "../_lib/page/AccrualsHeader";

const pageType: FinanceHeaderPageType = {
    object: "accruals",
    page: "grouped",
};

const Parent = dynamic(() => import("../_lib/page/AccrualsParent"));

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
            <AccrualsHeader
                searchParams={searchParams as FinanceSearchParams}
                page="grouped"
                users={users}
                depts={depts}
            />
            <Suspense fallback={<FinanceBodyLoading />}>
                <Parent
                    searchParams={searchParams as FinanceSearchParams}
                    periodOptions={periodOptions}
                    page="grouped"
                />
            </Suspense>
        </>
    );
}
