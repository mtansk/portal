import PaymentFormParent from "../../_lib/form/PaymentFormParent";

export default async function Page(props: {
    searchParams: Promise<any>;
    params: Promise<{
        id: string;
    }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    return <PaymentFormParent id={params.id} />;
}
