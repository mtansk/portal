import { ApiUser } from "@/app/types/user/Users";
import AccountsBody from "./AccountsBody";
import AccountsHeader from "./AccountsHeader";

const getStatusPriority = (user: ApiUser) => {
    if (user.account_status === "active") return 1;
    if (user.invite_id) return 2;
    if (user.account_status === "suspended") return 3;
    return 4;
};

export default function AccountsMain({ users }: { users: ApiUser[] }) {
    const filteredUsers = users.filter((user) => {
        if (user.account_status) {
            return true;
        }

        if (user.invite_id) {
            return true;
        }

        return false;
    });

    const sortedUsers = filteredUsers.sort((a, b) => {
        return getStatusPriority(a) - getStatusPriority(b);
    });

    return (
        <>
            <AccountsHeader />
            <AccountsBody users={sortedUsers} />
        </>
    );
}
