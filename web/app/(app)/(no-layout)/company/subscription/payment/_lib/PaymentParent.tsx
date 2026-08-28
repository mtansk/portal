import PaymentMain from "./PaymentMain";
import { PaymentSearchParams } from "../page";

export default async function PaymentParent({
    searchParams,
}: {
    searchParams: PaymentSearchParams;
}) {
    return (
        <>
            <PaymentMain searchParams={searchParams} />
        </>
    );
}
