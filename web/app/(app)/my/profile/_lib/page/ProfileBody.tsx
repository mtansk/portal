import { ApiMyAccount } from "@/app/types/access/Accounts";
import { ApiMyUser } from "@/app/types/user/Users";
import styles from "./css/body.module.scss";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { use } from "react";
import { ClientAccessStateContext } from "@/app/context/auth/ClientAccessStateContext";
import AccountBlock from "../blocks/AccountBlock";
import UserBlock from "../blocks/UserBlock";
import CompanyBlock from "../blocks/CompanyBlock";

export default function ProfileBody({
    account,
    users,
}: {
    account: ApiMyAccount;
    users: ApiMyUser[];
}) {
    const accessState = use(ClientAccessStateContext);

    const userId = accessState.state.userId;
    const currentUser = users.find((user) => user.user_id === userId);

    if (!currentUser) return null;

    return (
        <div className={styles.container}>
            <div className={styles.body_div}>
                <div className={styles.main_header}>Личный кабинет</div>
                <div className={styles.blocks}>
                    <AccountBlock account={account} />
                    <UserBlock currentUser={currentUser} />
                    <CompanyBlock users={users} />
                </div>
            </div>
        </div>
    );
}
