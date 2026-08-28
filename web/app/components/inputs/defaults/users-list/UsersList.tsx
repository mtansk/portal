"use client";
import { getUserFullnameString } from "@/app/functions/other";
import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import { useState } from "react";

import styles from "./list.module.scss";
import smartFiltering from "@/app/functions/smartFiltering";
import smartSorting from "@/app/functions/smartSorting";

export function UsersList({
    users,
    depts,

    initialUsers,
    type,

    onUserSelect,
}: {
    users: ApiUser[];
    depts: ApiDept[];

    initialUsers: string[];
    type: "single" | "multiple";

    onUserSelect: (users: string[]) => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");

    function handleUserClick(user: ApiUser) {
        const isSelected = initialUsers.includes(user.user_id);
        if (type === "single") {
            onUserSelect([user.user_id]);
        } else {
            if (isSelected) {
                onUserSelect(initialUsers.filter((id) => id !== user.user_id));
            } else {
                onUserSelect([...initialUsers, user.user_id]);
            }
        }
    }

    const sortedUsers = smartSorting(smartFiltering(searchQuery, users) || [], {
        col: "last_name",
        order: "ASC",
    });

    return (
        <div className={styles.main_div}>
            <div className={styles.search}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск"
                    className={styles.input}
                />
                {type === "multiple" && (
                    <button
                        onClick={() =>
                            onUserSelect(
                                sortedUsers.map((user) => user.user_id),
                            )
                        }
                        className={styles.select_all}
                    >
                        Выбрать всех <br /> показанных
                    </button>
                )}
            </div>
            <div className={styles.users_list}>
                {sortedUsers.length > 0 &&
                    depts.map((dept) => {
                        const deptUsers = sortedUsers.filter(
                            (user) => user.department_id === dept.department_id,
                        );

                        if (deptUsers.length === 0) return null;

                        return (
                            <div
                                className={styles.dept_div}
                                key={dept.department_id}
                            >
                                <div className={styles.department_name}>
                                    {dept.department_name}
                                </div>
                                <div className={styles.dept_body}>
                                    {deptUsers.map((user) => {
                                        const isSelected =
                                            initialUsers.includes(user.user_id);
                                        return (
                                            <button
                                                className={
                                                    styles.user_div +
                                                    " " +
                                                    (isSelected ?
                                                        styles.selected
                                                    :   "")
                                                }
                                                key={user.user_id}
                                                onClick={() => {
                                                    handleUserClick(user);
                                                }}
                                            >
                                                <div
                                                    className={styles.user_name}
                                                >
                                                    {getUserFullnameString(
                                                        user,
                                                    )}
                                                </div>
                                                <div
                                                    className={
                                                        styles.user_title
                                                    }
                                                >
                                                    {user.user_title}
                                                </div>
                                                <div
                                                    className={styles.checkbox}
                                                >
                                                    <input
                                                        type={
                                                            (
                                                                type ===
                                                                "multiple"
                                                            ) ?
                                                                "checkbox"
                                                            :   "radio"
                                                        }
                                                        checked={isSelected}
                                                        onChange={() => {}}
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                    {deptUsers.length === 0 && (
                                        <div className={styles.no_users}>
                                            Нет сотрудников.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                {sortedUsers.length === 0 && (
                    <div className={styles.no_users}>
                        Сотрудники не найдены.
                    </div>
                )}
            </div>
        </div>
    );
}
