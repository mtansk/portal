import { PaymentCheckSearchParams } from "../page";
import PaymentCheckMain from "./PaymentCheckMain";

export default async function PaymentCheckParent({
    searchParams,
}: {
    searchParams: PaymentCheckSearchParams;
}) {
    return <PaymentCheckMain searchParams={searchParams} />;
}
