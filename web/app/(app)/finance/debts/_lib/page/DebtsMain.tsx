"use client";

import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import { DebtsSearchParams } from "../../page";
import { DebtsBody } from "./DebtsBody";
import { ApiDebt } from "@/app/types/finance/debts/Debts";
import { useMemo } from "react";

export default function DebtsMain({
    searchParams,

    debts,
    users,
    depts,
}: {
    searchParams: DebtsSearchParams;

    debts: ApiDebt[];
    users: ApiUser[];
    depts: ApiDept[];
}) {
    const filteredDebts = debts.filter((debt) => {
        if (searchParams.settled === "false") {
            return debt.is_settled === 0;
        }
        return true;
    });

    const user_id = searchParams.uid;

    const filteredUsers = useMemo(() => {
        if (user_id) {
            const user = users.find((user) => user.user_id === user_id);
            return user ? [user] : [];
        } else {
            return users;
        }
    }, [users, user_id]);

    return (
        <DebtsBody
            debts={filteredDebts}
            users={filteredUsers}
            depts={depts}
            searchParams={searchParams}
        />
    );
}
