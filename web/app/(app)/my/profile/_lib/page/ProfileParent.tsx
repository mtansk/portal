import getMyAccount from "@/app/server-actions/my/accounts/getMyAccount";
import getMyUsers from "@/app/server-actions/my/users/getMyUsers";
import ProfileMain from "./ProfileMain";

export default async function ProfileParent() {
    const [account, users] = await Promise.all([getMyAccount(), getMyUsers()]);

    return (
        <ProfileMain
            account={account}
            users={users}
        />
    );
}
/* 

account
users

*/
