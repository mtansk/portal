"use client";

import styles from "./css/header.module.scss";

export default function MyDebtsHeader() {
    return (
        <div className={styles.finance_header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Мои задолженности</div>
            </div>
        </div>
    );
}
