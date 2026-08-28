import { SearchParams } from "next/dist/server/request/search-params";
import SheetFormAddParent from "../../_lib/form/SheetFormAddParent";

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParams = await props.searchParams;

    return <SheetFormAddParent searchParams={searchParams} />;
}
