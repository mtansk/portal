import AddUserButton from "./AddUserButton";
import styles from "./css/header.module.scss";
import { Suspense } from "react";

export default function UsersHeader({}: {}) {
    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Список сотрудников</div>
                <div className={styles.add}>
                    <Suspense>
                        <AddUserButton />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
