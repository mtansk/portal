import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import { SearchParams } from "next/dist/server/request/search-params";
import DebtForm from "./DebtForm";
import getDebts from "@/app/server-actions/finance/debts/getDebts";
import getUsers from "@/app/server-actions/users/getUsers";
import getReductions from "@/app/server-actions/finance/reductions/getReductions";
import getDepts from "@/app/server-actions/departments/getDepts";

export default async function DebtFormParent({
    id,
    searchParams,
}: {
    id: string;
    searchParams: SearchParams;
}) {
    const debt = await getDebts({ id });

    const [users, depts, reductions] = await Promise.all([
        getUsers({}),
        getDepts({}),
        getReductions({
            params: {
                paramsString: `&debt_id=${id}`,
            },
        }),
    ]);

    if (!debt) {
        throw new Error("Такой задолженности не существует");
    }

    return (
        <FormPageContainer title="Задолженность">
            <DebtForm
                initialDebt={debt}
                users={users}
                depts={depts}
                type="edit"
                reductions={reductions}
            />
        </FormPageContainer>
    );
}
