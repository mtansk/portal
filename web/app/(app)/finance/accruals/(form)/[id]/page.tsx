import { SearchParams } from "next/dist/server/request/search-params";
import AccrualFormParent from "../../_lib/form/AccrualsFormParent";

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
    params: Promise<{
        id: string;
    }>;
}) {
    const params = await props.params;

    return <AccrualFormParent id={params.id} />;
}
