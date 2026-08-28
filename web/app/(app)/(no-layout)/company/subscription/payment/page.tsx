import { SearchParams } from "next/dist/server/request/search-params";
import PaymentParent from "./_lib/PaymentParent";
import { paramArrayToString } from "@/app/functions/other";
import { redirect } from "next/navigation";
import postInitialize from "@/app/server-actions/transactions/postInitialize";

export type PaymentSearchParams = {
    q: string;
    ct: string;
    transaction_id: string;
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;
    const q = paramArrayToString(searchParamsRes.q);
    const ct = paramArrayToString(searchParamsRes.ct);

    if (!q) {
        redirect("/company/subscription/buy");
    }

    if (!ct) {
        const res = await postInitialize({ qty: q });
        redirect(
            `/company/subscription/payment?q=${q}&ct=${res.data[0].ct}&transaction_id=${res.data[0].transaction_id}`,
        );
    }

    return (
        <PaymentParent searchParams={searchParamsRes as PaymentSearchParams} />
    );
}
