import { Link } from "react-transition-progress/next";
import styles from "./column.module.scss";

export function DesktopMenuColumn({
    header,
    links,
    path,
}: {
    header: {
        title: string;
        href: string;
    };
    links: {
        title: string;
        href: string;
        icon?: string;
    }[];
    path: string;
}) {
    return (
        <div className={styles.menu_column}>
            <Link
                className={styles.menu_header}
                href={header.href}
            >
                {header.title}
            </Link>
            {links.map((link) => {
                const isActive = path.includes(link.href);
                const isActive2 =
                    path.substring(0, link.href.length) === link.href;

                return (
                    <Link
                        className={
                            styles.menu_link +
                            " " +
                            (isActive2 ? styles.active : "")
                        }
                        href={link.href}
                        key={link.href}
                    >
                        <div className={styles.link_text}>{link.title}</div>
                        {link.icon && (
                            <div className={"icon " + styles.link_icon}>
                                {link.icon}
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
