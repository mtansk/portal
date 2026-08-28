import getMyAccruals from "@/app/server-actions/my/finance/getMyAccruals";
import { MyFinanceSearchParams } from "../../page";
import getMyPayments from "@/app/server-actions/my/finance/getMyPayments";
import getMyReductions from "@/app/server-actions/my/finance/getMyReductions";
import getMySheets from "@/app/server-actions/my/sheets/getMySheets";
import MyFinanceMain from "./MyFinanceMain";

export default async function MyFinanceParent({
    searchParams,
}: {
    searchParams: MyFinanceSearchParams;
}) {
    const params = {
        start: searchParams.start,
        end: searchParams.end,
    };

    const [sheets, accruals, payments, reductions] = await Promise.all([
        getMySheets({
            params: {
                start: searchParams.start,
                end: searchParams.end,
                paramsString: "&sheet_status=workday",
            },
        }),
        getMyAccruals({ params }),
        getMyPayments({ params }),
        getMyReductions({ params }),
    ]);

    const filteredAccruals = filterByArchive(accruals, searchParams.a);
    const filteredPayments = filterByArchive(payments, searchParams.a);
    const filteredReductions = filterByArchive(reductions, searchParams.a);
    const filteredSheets = filterByArchive(sheets, searchParams.a);

    return (
        <MyFinanceMain
            searchParams={searchParams}
            sheets={filteredSheets}
            accruals={filteredAccruals}
            payments={filteredPayments}
            reductions={filteredReductions}
        />
    );
}

function filterByArchive<T extends { payslip_id: string | null }>(
    array: T[],
    archive: string,
) {
    return array.filter((item) => {
        if (archive === "active") {
            return item.payslip_id === null;
        } else if (archive === "archive") {
            return item.payslip_id !== null;
        } else {
            return true;
        }
    });
}
