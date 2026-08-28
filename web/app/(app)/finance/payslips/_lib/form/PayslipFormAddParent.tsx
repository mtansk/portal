import getAccruals from "@/app/server-actions/finance/accruals/getAccruals";
import { PayslipsAddParams } from "../../(form)/add/page";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import getSheets from "@/app/server-actions/sheets/getSheets";
import getUsers from "@/app/server-actions/users/getUsers";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import PayslipForm from "./form-body/PayslipForm";
import getPayments from "@/app/server-actions/finance/payments/getPayments";
import getReductions from "@/app/server-actions/finance/reductions/getReductions";
import { defaultPayslipObject } from "@/app/types/finance/payslip/Payslips";

export default async function PayslipFormAddParent({
    searchParams,
    periodOptions,
}: {
    searchParams: PayslipsAddParams;
    periodOptions: PeriodOptions;
}) {
    if (!searchParams.uid) {
        throw new Error("Не указан пользователь.");
    }

    const params = {
        params: {
            user_id: searchParams.uid,
            show_only_active: "true",
        },
    };

    const [accruals, sheets, reductions, payments, user] = await Promise.all([
        getAccruals(params),
        getSheets({
            params: {
                show_only_active: "true",
                user_id: searchParams.uid,
                paramsString: "&sheet_status=workday",
            },
        }),
        getReductions(params),
        getPayments(params),
        getUsers({ id: searchParams.uid }),
    ]);

    const mergedAccruals = [...accruals, ...sheets];

    if (!user) {
        throw new Error("Пользователь не найден.");
    }

    const initialPayslip = {
        ...defaultPayslipObject,
        user_id: searchParams.uid,
        payslip_st_date: periodOptions.start,
        payslip_en_date: periodOptions.end,
        payslip_date: periodOptions.end,
    };

    return (
        <FormPageContainer title="Расчетный лист">
            <PayslipForm
                initialPayslip={initialPayslip}
                type="add"
                accruals={mergedAccruals}
                reductions={reductions}
                payments={payments}
                taxes={[]}
                taxDeductions={[]}
                socialFees={[]}
                user={user}
                periodOptions={periodOptions}
                searchParams={searchParams}
            />
        </FormPageContainer>
    );
}
