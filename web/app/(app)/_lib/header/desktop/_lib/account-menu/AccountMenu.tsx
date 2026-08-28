import { Link } from "react-transition-progress/next";
import styles from "./account-menu.module.scss";

export default function AccountMenu() {
    return (
        <div className={styles.account_menu}>
            <Link
                href="/my/profile"
                className={styles.button}
                prefetch={false}
            >
                Настройки
            </Link>
            <Link
                href="/auth/logout"
                className={styles.button}
                prefetch={false}
            >
                Выход
            </Link>
        </div>
    );
}
