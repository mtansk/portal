import { Suspense } from "react";
import styles from "./css/header.module.scss";
import AddUserButton from "../../../list/_lib/page/AddUserButton";

export default function AccountsHeader() {
    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Аккаунты и приглашения</div>
                <div className={styles.add}>
                    <Suspense>
                        <AddUserButton />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
