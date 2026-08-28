import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import { SearchParams } from "next/dist/server/request/search-params";
import DebtForm from "./DebtForm";
import getUsers from "@/app/server-actions/users/getUsers";
import { defaultDebtObject } from "@/app/types/finance/debts/Debts";
import { paramArrayToString } from "@/app/functions/other";
import getDepts from "@/app/server-actions/departments/getDepts";

export default async function DebtFormAddParent({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const [users, depts] = await Promise.all([
        getUsers({
            params: { show_deleted: "false" },
        }),
        getDepts({}),
    ]);

    const user_id = paramArrayToString(searchParams.uid);

    return (
        <FormPageContainer title="Задолженность">
            <DebtForm
                reductions={[]}
                initialDebt={{ ...defaultDebtObject, user_id }}
                type="add"
                users={users}
                depts={depts}
            />
        </FormPageContainer>
    );
}
