import getUsers from "@/app/server-actions/users/getUsers";
import AccountsMain from "./AccountsMain";

export default async function AccountsParent() {
    const [users] = await Promise.all([getUsers({})]);

    return <AccountsMain users={users} />;
}
