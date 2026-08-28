import { Suspense } from "react";
import SheetFormParent from "../../_lib/form/SheetFormParent";
import FormPageLoading from "@/app/components/form/form-page-loading/FormPageLoading";

export default async function Page({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const paramsRes = await params;

    const id = paramsRes.id;

    return (
        <Suspense fallback={<FormPageLoading />}>
            <SheetFormParent id={id} />
        </Suspense>
    );
}
