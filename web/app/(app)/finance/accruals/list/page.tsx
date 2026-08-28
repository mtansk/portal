import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";
import AccrualsParent from "../_lib/page/AccrualsParent";
import { FinanceHeaderPageType } from "../../_lib/other/FinanceHeader";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";
import FinanceBodyLoading from "../../_lib/efo-body/components/FinanceBodyLoading";
import { efoParamsHandler } from "../../_lib/functions";
import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";
import AccrualsHeader from "../_lib/page/AccrualsHeader";

const pageType: FinanceHeaderPageType = {
    object: "accruals",
    page: "list",
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const { searchParams: searchParamsRes, periodOptions } =
        await efoParamsHandler(searchParams, pageType);

    const depts = getDepts({});
    const users = getUsers({});

    return (
        <>
            <AccrualsHeader
                searchParams={searchParamsRes as FinanceSearchParams}
                page="list"
                users={users}
                depts={depts}
            />
            <Suspense fallback={<FinanceBodyLoading />}>
                <AccrualsParent
                    searchParams={searchParamsRes as FinanceSearchParams}
                    periodOptions={periodOptions}
                    page="list"
                />
            </Suspense>
        </>
    );
}
