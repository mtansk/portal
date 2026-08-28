import { SearchParams } from "next/dist/server/request/search-params";
import PaymentFormAddParent from "../../_lib/form/PaymentFormAddParent";

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParams = await props.searchParams;

    return <PaymentFormAddParent searchParams={searchParams} />;
}
