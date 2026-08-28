import { Link } from "react-transition-progress/next";
import styles from "./css/not-found.module.scss";

export default async function NotFound() {
    return (
        <div className={styles.body}>
            <div className={styles.main_div}>
                <div className={styles.header}>
                    {`404. Такой страницы не существует`}
                </div>
                <div className={styles.note}>
                    {`Страница, которую вы ищете, не существует. Если вы считаете, что она 
                должна быть, пожалуйста, скопируйте адрес этой страницы, сделайте скриншот и обратитесь в поддержку.`}
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
