import { Link } from "react-transition-progress/next";
import styles from "./header-link.module.scss";

export function HeaderLink({
    href,
    title,
    pathname,
    className,
}: {
    href: string;
    title: string;
    pathname: string;
    className?: string;
}) {
    const isActive = pathname.includes(href);

    return (
        <Link
            href={href}
            className={
                styles.header_link +
                " " +
                (isActive ? styles.active : "") +
                " " +
                className
            }
        >
            {title}
        </Link>
    );
}
