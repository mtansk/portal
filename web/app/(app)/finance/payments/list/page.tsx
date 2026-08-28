import PaymentsParent from "../_lib/page/PaymentsParent";
import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";
import { efoParamsHandler } from "../../_lib/functions";
import FinanceBodyLoading from "../../_lib/efo-body/components/FinanceBodyLoading";
import { FinanceHeaderPageType } from "../../_lib/other/FinanceHeader";
import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";
import PaymentsHeader from "../_lib/page/PaymentsHeader";

export const experimental_ppr = true;

const pageType: FinanceHeaderPageType = {
    object: "payments",
    page: "list",
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
            <PaymentsHeader
                depts={depts}
                users={users}
                page="list"
                searchParams={searchParams as FinanceSearchParams}
            />
            <Suspense fallback={<FinanceBodyLoading />}>
                <PaymentsParent
                    searchParams={searchParams as FinanceSearchParams}
                    periodOptions={periodOptions}
                    type="list"
                />
            </Suspense>
        </>
    );
}
