import AccrualForm from "./AccrualsForm";
import getAccruals from "@/app/server-actions/finance/accruals/getAccruals";
import getUsers from "@/app/server-actions/users/getUsers";
import getAccrualGroups from "@/app/server-actions/accrual-groups/getAccrualGroups";
import getGeneralRates from "@/app/server-actions/rates/general/getGeneralRates";
import { ModifiedRate } from "../page/AccrualsMain";
import { Formatter } from "@/app/classes/Formatter";
import { IDBGeneralRate } from "@/app/types/general-rate/GeneralRates";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";

export function modifyRates(rates: IDBGeneralRate[]) {
    return (rates as ModifiedRate[]).map((rate) => {
        rate.formattedRateNumber = parseFloat(rate.general_rate_rate);
        rate.formattedRateString = Formatter.currencyString({
            value: rate.general_rate_rate,
        });
        return rate;
    });
}

export default async function AccrualFormParent({ id }: { id: string }) {
    const [accrual] = await Promise.all([getAccruals({ id })]);

    if (!accrual) {
        throw new Error("Такого начисления не существует.");
    }

    const user = await getUsers({ id: accrual?.user_id });

    const _user = user ? [user] : [];

    if (!accrual || !user) {
        throw new Error("Такого начисления не существует.");
    }

    const [groups, rates, payslips] = await Promise.all([
        getAccrualGroups(),
        getGeneralRates(),
        getPayslips({ params: { user_id: accrual.user_id } }),
    ]);

    return (
        <FormPageContainer title="Начисление">
            <AccrualForm
                initialAccrual={accrual}
                rates={rates}
                accrualGroups={groups}
                users={_user}
                payslips={payslips}
                view="page"
                type={"edit"}
                options={{
                    user: "fixed",
                    date: "single",
                    payslip: true,
                }}
            />
        </FormPageContainer>
    );
}
