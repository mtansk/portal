import { SearchParams } from "next/dist/server/request/search-params";
import PaymentCheckParent from "./_lib/PaymentCheckParent";
import { paramArrayToString } from "@/app/functions/other";
import { redirect } from "next/navigation";

export type PaymentCheckSearchParams = {
    transaction_id: string;
    q: string;
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;
    const transactionId = paramArrayToString(searchParamsRes.transaction_id);
    const q = paramArrayToString(searchParamsRes.q);

    if (!transactionId || !q) {
        redirect("/company/subscription/buy");
    }

    return (
        <PaymentCheckParent
            searchParams={searchParamsRes as PaymentCheckSearchParams}
        />
    );
}
