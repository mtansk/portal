import { ApiDept } from "@/app/types/depts/Depts";
import styles from "./css/dept.module.scss";

export function FinanceDeptBlock({
    dept,
    total,

    children,
}: {
    dept: ApiDept;
    total: React.ReactNode;

    children: React.ReactNode;
}) {
    return (
        <div
            className={styles.dept_div}
            key={dept.department_id}
        >
            <div className={styles.name}>{dept.department_name}</div>
            <div className={styles.users_div}>{children}</div>
            <div className={styles.dept_total}>
                <div className={styles.text}>
                    Всего <span>по отображенным</span>:
                </div>
                <div className={styles.total}>{total}</div>
            </div>
        </div>
    );
}
