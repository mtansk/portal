"use client";

import { ApiMyAccount } from "@/app/types/access/Accounts";
import { ApiMyUser } from "@/app/types/user/Users";
import ProfileBody from "./ProfileBody";

export default function ProfileMain({
    account,
    users,
}: {
    account: ApiMyAccount;
    users: ApiMyUser[];
}) {
    return (
        <ProfileBody
            account={account}
            users={users}
        />
    );
}
