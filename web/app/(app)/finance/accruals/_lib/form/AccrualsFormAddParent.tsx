import { defaultAccrualObject } from "@/app/types/finance/accrual/Accruals";
import AccrualForm from "./AccrualsForm";
import getUsers from "@/app/server-actions/users/getUsers";
import getAccrualGroups from "@/app/server-actions/accrual-groups/getAccrualGroups";
import getGeneralRates from "@/app/server-actions/rates/general/getGeneralRates";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import { SearchParams } from "next/dist/server/request/search-params";
import { paramArrayToString } from "@/app/functions/other";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";
import getDepts from "@/app/server-actions/departments/getDepts";

export default async function AccrualFormAddParent({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const user_id = paramArrayToString(searchParams.uid);

    if (!user_id) {
        throw new Error("Не указан пользователь.");
    }

    if (user_id === "multiple") {
        const [groups, users, depts, rates] = await Promise.all([
            getAccrualGroups(),
            getUsers({
                params: {
                    show_deleted: "false",
                },
            }),
            getDepts({}),
            getGeneralRates(),
        ]);

        const obj = { ...defaultAccrualObject };

        return (
            <FormPageContainer title="Начисление">
                <AccrualForm
                    initialAccrual={obj}
                    rates={rates}
                    accrualGroups={groups}
                    users={users}
                    depts={depts}
                    view="page"
                    type={"add"}
                    options={{
                        user: "multiple",
                        date: "multiple",
                        payslip: false,
                    }}
                />
            </FormPageContainer>
        );
    }

    const user = await getUsers({ id: user_id });

    if (!user) {
        throw new Error("Такого пользователя не существует.");
    }

    const [groups, rates, payslips] = await Promise.all([
        getAccrualGroups(),
        getGeneralRates(),
        getPayslips({ params: { user_id } }),
    ]);

    const def = { ...defaultAccrualObject, user_id: user_id };

    return (
        <FormPageContainer title="Начисление">
            <AccrualForm
                initialAccrual={def}
                rates={rates}
                accrualGroups={groups}
                users={[user]}
                payslips={payslips}
                view="page"
                type={"add"}
                options={{
                    user: "fixed",
                    date: "multiple",
                    payslip: true,
                }}
            />
        </FormPageContainer>
    );
}
