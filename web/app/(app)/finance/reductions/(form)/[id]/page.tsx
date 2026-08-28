import { SearchParams } from "next/dist/server/request/search-params";
import ReductionFormParent from "../../_lib/form/ReductionFormParent";

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
    params: Promise<{
        id: string;
    }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    return <ReductionFormParent id={params.id} />;
}
