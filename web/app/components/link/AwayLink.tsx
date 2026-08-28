import { Link } from "react-transition-progress/next";
import styles from "./away.module.scss";

export default function AwayLink({
    title,
    href,
}: {
    title: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className={styles.away_link}
        >
            <div className={styles.text}>{title}</div>
            <div className={styles.icon + " icon"}>open_in_new</div>
        </Link>
    );
}
