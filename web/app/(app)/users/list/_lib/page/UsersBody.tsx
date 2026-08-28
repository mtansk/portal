import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";

import styles from "./css/body.module.scss";
import { Link } from "react-transition-progress/next";
import { getUserFullnameString } from "@/app/functions/other";

function UsersBody({ users, depts }: { users: ApiUser[]; depts: ApiDept[] }) {
    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.depts_div}>
                    {depts.map((dept) => {
                        const deptUsers = users.filter(
                            (user) => user.department_id === dept.department_id,
                        );

                        if (deptUsers.length === 0) return null;

                        return (
                            <div
                                className={styles.dept_div}
                                key={dept.department_id}
                            >
                                <div className={styles.dept_name}>
                                    {dept.department_name}
                                </div>
                                <div className={styles.users}>
                                    {deptUsers.map((user) => {
                                        return (
                                            <Link
                                                key={user.user_id}
                                                href={`/users/${user.user_id}?backurl=${encodeURIComponent("/users/list")}`}
                                            >
                                                <div
                                                    className={styles.user_div}
                                                    key={user.user_id}
                                                >
                                                    <div
                                                        className={styles.name}
                                                    >
                                                        {getUserFullnameString(
                                                            user,
                                                            true,
                                                        )}
                                                    </div>
                                                    <div
                                                        className={styles.title}
                                                    >
                                                        {user.user_title}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                    {deptUsers.length === 0 &&
                                        "Нет сотрудников."}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.info_div}>
                    Всего сотрудников: {users.length}
                    <Link
                        href={"/company/departments"}
                        className={styles.users_link}
                    >
                        Всего отделов: {depts.length}
                    </Link>
                </div>
            </div>
        </div>
    );
} /* ); */

export default UsersBody;
