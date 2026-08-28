import { MyPayslipsSearchParams } from "../../page";
import getMyPayslips from "@/app/server-actions/my/finance/getMyPayslips";
import MyPayslipsMain from "./MyPayslipsMain";

export default async function MyPayslipsParent({
    searchParams,
}: {
    searchParams: MyPayslipsSearchParams;
}) {
    const params = {
        start: searchParams.start,
        end: searchParams.end,
    };

    const [payslips] = await Promise.all([getMyPayslips({ params })]);

    return (
        <MyPayslipsMain
            searchParams={searchParams}
            payslips={payslips}
        />
    );
}
