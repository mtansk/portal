"use client";

import { Link } from "react-transition-progress/next";
import styles from "./../css/error.module.scss";

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
}) {
    return (
        <div className={styles.body}>
            <div className={styles.main_div}>
                <div
                    className={styles.header}
                >{`Ошибка! ${error.message}`}</div>
                <div className={styles.note}>
                    {`Произошла ошибка. Пожалуйста, сделайте скриншот этой страницы и обратитесь в поддержку.`}
                </div>
                <div className={styles.links}>
                    <Link
                        href="/my/profile"
                        className={styles.link}
                    >
                        Мой профиль
                    </Link>
                </div>
            </div>
        </div>
    );
}
