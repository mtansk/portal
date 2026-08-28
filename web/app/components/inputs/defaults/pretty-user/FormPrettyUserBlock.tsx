import { getUserFullnameString } from "@/app/functions/other";
import styles from "./user-block.module.scss";

export function FormPrettyUserBlock({
    user,
}: {
    user:
        | {
              first_name: string;
              last_name: string | null;
              middle_name: string | null;
              user_title: string | null;
              department_name: string;
          }
        | undefined;
}) {
    return (
        <div className={styles.user_div}>
            <div className={styles.dept}>{user?.department_name}</div>
            <div className={styles.name}>
                {user ? getUserFullnameString(user) : "Ваш объект"}
            </div>
            <div className={styles.title}>{user?.user_title}</div>
        </div>
    );
}
