import ReductionForm from "./ReductionsForm";
import getUsers from "@/app/server-actions/users/getUsers";
import getDebts from "@/app/server-actions/finance/debts/getDebts";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";
import { defaultReductionObject } from "@/app/types/finance/reductions/Reductions";
import getDepts from "@/app/server-actions/departments/getDepts";
import { paramArrayToString } from "@/app/functions/other";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function ReductionFormAddParent({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const user_id = paramArrayToString(searchParams.uid);

    if (!user_id) {
        throw new Error("Не указан пользователь.");
    }

    if (user_id === "multiple") {
        const [users, depts] = await Promise.all([
            getUsers({
                params: {
                    show_deleted: "false",
                },
            }),
            getDepts({}),
        ]);

        return (
            <FormPageContainer title="Выплата">
                <ReductionForm
                    initialReduction={defaultReductionObject}
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

    const [payslips, debts] = await Promise.all([
        getPayslips({ params: { user_id: user_id } }),
        getDebts({ params: { user_id: user_id } }),
    ]);

    const def = { ...defaultReductionObject, user_id: user_id };

    return (
        <FormPageContainer title="Удержание">
            <ReductionForm
                initialReduction={def}
                users={[user]}
                payslips={payslips}
                debts={debts}
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
