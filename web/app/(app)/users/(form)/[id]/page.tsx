import { SearchParams } from "next/dist/server/request/search-params";
import UserFormParent from "./_lib/UserFormParent";

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
    params: Promise<{
        id: string;
    }>;
}) {
    const params = await props.params;

    return <UserFormParent id={params.id} />;
}
