import styles from "./css/header.module.scss";

export default function DeletedUsersHeader() {
    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Удаленные сотрудники</div>
            </div>
        </div>
    );
}
