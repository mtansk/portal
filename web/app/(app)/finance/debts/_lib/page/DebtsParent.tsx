import getDebts from "@/app/server-actions/finance/debts/getDebts";
import { DebtsSearchParams } from "../../page";
import getUsers from "@/app/server-actions/users/getUsers";
import getDepts from "@/app/server-actions/departments/getDepts";
import DebtsMain from "./DebtsMain";

export default async function DebtsParent({
    searchParams,
}: {
    searchParams: DebtsSearchParams;
}) {
    const [debts, users, depts] = await Promise.all([
        getDebts({
            params: {},
        }),
        getUsers({}),
        getDepts({}),
    ]);

    return (
        <DebtsMain
            debts={debts}
            depts={depts}
            searchParams={searchParams}
            users={users}
        />
    );
}
