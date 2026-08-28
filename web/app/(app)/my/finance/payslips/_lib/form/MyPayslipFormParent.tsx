import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import { SearchParams } from "next/dist/server/request/search-params";
import getMyPayslips from "@/app/server-actions/my/finance/getMyPayslips";
import getMyAccruals from "@/app/server-actions/my/finance/getMyAccruals";
import getMySheets from "@/app/server-actions/my/sheets/getMySheets";
import getMyReductions from "@/app/server-actions/my/finance/getMyReductions";
import getMyPayments from "@/app/server-actions/my/finance/getMyPayments";
import getMyTaxes from "@/app/server-actions/my/finance/getMyTaxes";
import getMyTaxDeductions from "@/app/server-actions/my/finance/getMyTaxDeductions";
import getMySocialFees from "@/app/server-actions/my/finance/getMySocialFees";
import MyPayslipForm from "./form-body/MyPayslipForm";

export default async function MyPayslipFormParent({
    id,
    searchParams,
}: {
    id: string;
    searchParams: SearchParams;
}) {
    const [payslip] = await Promise.all([
        getMyPayslips({
            id,
            params: {
                show_deleted: "true",
            },
        }),
    ]);

    if (!payslip) {
        throw new Error("Расчетный лист не найден.");
    }

    const paramsObj = {
        params: {
            payslip_id: id,
        },
    };
    const [
        accruals,
        sheets,
        reductions,
        payments,
        taxes,
        taxDeductions,
        socialFees,
    ] = await Promise.all([
        getMyAccruals(paramsObj),
        getMySheets(paramsObj),
        getMyReductions(paramsObj),
        getMyPayments(paramsObj),
        getMyTaxes(paramsObj),
        getMyTaxDeductions(paramsObj),
        getMySocialFees(paramsObj),
    ]);

    const mergedAccruals = [...accruals, ...sheets];

    return (
        <FormPageContainer title="Ваш расчетный лист">
            <MyPayslipForm
                payslip={payslip}
                accruals={mergedAccruals}
                reductions={reductions}
                payments={payments}
                taxes={taxes}
                taxDeductions={taxDeductions}
                socialFees={socialFees}
            />
        </FormPageContainer>
    );
}
