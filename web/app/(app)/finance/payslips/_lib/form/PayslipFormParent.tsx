import getAccruals from "@/app/server-actions/finance/accruals/getAccruals";
import getSheets from "@/app/server-actions/sheets/getSheets";
import getUsers from "@/app/server-actions/users/getUsers";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import PayslipForm from "./form-body/PayslipForm";
import getPayments from "@/app/server-actions/finance/payments/getPayments";
import getReductions from "@/app/server-actions/finance/reductions/getReductions";
import getTaxes from "@/app/server-actions/finance/taxes/getTaxes";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";
import getTaxDeductions from "@/app/server-actions/finance/tax-deductions/getTaxDeductions";
import getSocialFees from "@/app/server-actions/finance/social-fees/getSocialFees";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function PayslipFormParent({
    id,
    searchParams,
}: {
    id: string;
    searchParams: SearchParams;
}) {
    const [payslip] = await Promise.all([
        getPayslips({
            id,
            params: {
                show_deleted: "true",
            },
        }),
    ]);

    if (!payslip) {
        throw new Error("Расчетный лист не найден.");
    }

    const user = await getUsers({ id: payslip.user_id });

    if (!user) {
        throw new Error("Пользователь не найден.");
    }

    const paramsObj = {
        params: {
            payslip_id: id,
        },
    };
    const extParamsObj = {
        params: {
            extended_payslip_id: id,
            user_id: payslip.user_id,
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
        getAccruals(extParamsObj),
        getSheets({
            params: {
                ...extParamsObj.params,
                paramsString: "&sheet_status=workday",
            },
        }),
        getReductions(extParamsObj),
        getPayments(extParamsObj),
        getTaxes(paramsObj),
        getTaxDeductions(paramsObj),
        getSocialFees(paramsObj),
    ]);

    const mergedAccruals = [...accruals, ...sheets];

    return (
        <FormPageContainer title="Расчетный лист">
            <PayslipForm
                initialPayslip={payslip}
                type="edit"
                accruals={mergedAccruals}
                reductions={reductions}
                payments={payments}
                taxes={taxes}
                taxDeductions={taxDeductions}
                socialFees={socialFees}
                user={user}
                payslip_id={id}
                searchParams={searchParams}
                key={payslip.now}
            />
        </FormPageContainer>
    );
}
