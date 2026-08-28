import { ApiUser } from "@/app/types/user/Users";

import styles from "./css/body.module.scss";
import { Link } from "react-transition-progress/next";
import { getUserFullnameString } from "@/app/functions/other";
import { accountStatusString } from "@/app/functions/users";
import { accessLevelString } from "@/app/functions/users";

export default function AccountsBody({ users }: { users: ApiUser[] }) {
    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.users}>
                    {users.map((user) => {
                        if (user.account_status === "suspended") {
                            return null;
                        }
                        return (
                            <UserDiv
                                user={user}
                                key={user.user_id}
                            />
                        );
                    })}
                    <div className={styles.separator}></div>
                    {users.map((user) => {
                        if (user.account_status !== "suspended") {
                            return null;
                        }
                        return (
                            <UserDiv
                                user={user}
                                key={user.user_id}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function UserDiv({ user }: { user: ApiUser }) {
    return (
        <Link
            key={user.user_id}
            href={`/users/${user.user_id}?backurl=${encodeURIComponent("/users/accounts")}`}
        >
            <div
                className={
                    styles.user_div +
                    " " +
                    styles[user.account_status || ""] +
                    " " +
                    styles[user.invite_id ? "invited" : ""]
                }
                key={user.user_id}
            >
                <div className={styles.dept}>{user.department_name}</div>
                <div className={styles.name}>
                    {getUserFullnameString(user, true)}
                </div>
                <div className={styles.title}>{user.user_title}</div>
                <div
                    className={
                        styles.status +
                        " " +
                        styles[user.account_status || ""] +
                        " " +
                        styles[
                            user.invite_id && !user.account_status ?
                                "invited"
                            :   ""
                        ]
                    }
                >
                    {accountStatusString(user)}
                </div>

                {user.account_status === "active" && (
                    <div className={styles.access_level}>
                        {accessLevelString(user.access_level)}
                    </div>
                )}
            </div>
        </Link>
    );
}
