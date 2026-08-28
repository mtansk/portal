"use client";

import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import { memo } from "react";

import styles from "./css/body.module.scss";
import { MAX_DEPTS, MAX_USERS } from "@/app/global/MAX_NUMBERS";
import { Link } from "react-transition-progress/next";
import { departmentsColors } from "../form/DepartmentForm";

const DepartmentsBody = memo(function DepartmentsBody({
    users,
    depts,

    onDeptClick,
}: {
    users: ApiUser[];
    depts: ApiDept[];

    onDeptClick: (id: string) => void;
}) {
    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.depts_div}>
                    {depts.map((dept, i) => {
                        const deptUsers = users.filter(
                            (user) => user.department_id === dept.department_id,
                        );
                        const color = departmentsColors.find(
                            (c) => c.color === dept.department_color,
                        );

                        return (
                            <div
                                className={styles.dept_div}
                                key={`${dept.department_id}-${i}`}
                                onClick={() => onDeptClick(dept.department_id)}
                            >
                                <div className={styles.department_name}>
                                    {dept.department_name}
                                </div>
                                <div className={styles.dept_info}>
                                    <div className={styles.users}>
                                        Сотрудников: {deptUsers.length}
                                    </div>
                                    <div className={styles.color}>
                                        <div className={styles.color_title}>
                                            {`Цвет: ${color?.name}`}
                                        </div>
                                        <div
                                            className={styles.color_box}
                                            style={{
                                                backgroundColor: color?.color,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.info_div}>
                    <Link
                        href={"/users"}
                        className={styles.users_link}
                    >
                        Всего сотрудников: {users.length}
                    </Link>
                    Всего отделов: {depts.length}
                </div>
            </div>
        </div>
    );
});

export default DepartmentsBody;
