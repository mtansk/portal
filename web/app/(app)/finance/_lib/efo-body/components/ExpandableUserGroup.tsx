"use client";

import { useCachedExpandedState } from "@/app/components/hooks/useCachedExpandedState";
import { ApiUser } from "@/app/types/user/Users";

import styles from "./css/exp.module.scss";

export function ExpandableUserGroup({
    user,
    total,
    storageTag,
    children,
}: {
    user: ApiUser;
    total: React.ReactNode;

    storageTag: string;
    children: React.ReactNode;
}) {
    const { isExpanded, handleExpandableClick } = useCachedExpandedState(
        storageTag,
        user.user_id,
    );

    return (
        <div
            className={styles.user_div}
            id={`${user.user_id}`}
        >
            <div
                className={styles.main_div}
                onClick={handleExpandableClick}
            >
                <div className={"icon " + styles.arrow}>
                    {isExpanded ?
                        "keyboard_arrow_down"
                    :   "keyboard_arrow_right"}
                </div>
                <div className={styles.name}>
                    {`${user.last_name || ""} ${user.first_name}`}
                </div>
                <div className={styles.title}>{user.user_title || ""}</div>
                {user.deleted_at && (
                    <div className={"icon " + styles.deleted_icon}>delete</div>
                )}
                <div className={`${styles.total}`}>{total}</div>
            </div>

            {isExpanded && (
                <div className={styles.children_div}>{children}</div>
            )}
        </div>
    );
}
