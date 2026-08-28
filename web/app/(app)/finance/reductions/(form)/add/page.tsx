import ReductionFormAddParent from "../../_lib/form/ReductionFormAddParent";

export default async function Page(props: { searchParams: Promise<any> }) {
    const searchParams = await props.searchParams;

    return <ReductionFormAddParent searchParams={searchParams} />;
}
