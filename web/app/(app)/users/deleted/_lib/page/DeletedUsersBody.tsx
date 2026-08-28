import { ApiUser } from "@/app/types/user/Users";

import styles from "./css/body.module.scss";
import { Link } from "react-transition-progress/next";
import { getUserFullnameString } from "@/app/functions/other";
import { sqlTimestampToUTCDate } from "@/app/functions/dates";

export default function DeletedUsersBody({ users }: { users: ApiUser[] }) {
    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.users}>
                    {users.map((user) => {
                        return (
                            <UserDiv
                                user={user}
                                key={user.user_id}
                            />
                        );
                    })}
                    {users.length === 0 && (
                        <div>Нет удаленных сотрудников.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function UserDiv({ user }: { user: ApiUser }) {
    if (user.deleted_at === null) return null;

    return (
        <Link
            key={user.user_id}
            href={`/users/${user.user_id}?backurl=${encodeURIComponent("/users/deleted")}`}
        >
            <div
                className={styles.user_div}
                key={user.user_id}
            >
                <div className={styles.dept}>{user.department_name}</div>
                <div className={styles.name}>
                    {getUserFullnameString(user, true)}
                </div>
                <div className={styles.title}>{user.user_title}</div>
                <div className={styles.deleted}>
                    {`Удален ${Intl.DateTimeFormat("ru", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "UTC",
                        timeZoneName: "short",
                    }).format(sqlTimestampToUTCDate(user.deleted_at))}`}
                </div>
            </div>
        </Link>
    );
}
