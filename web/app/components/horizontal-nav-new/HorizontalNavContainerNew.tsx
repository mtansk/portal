"use client";

import { usePathname } from "next/navigation";
import { Link } from "react-transition-progress/next";
import styles from "./css/horizontal-nav.module.scss";

export type HorizontalNavLink = {
    name: string;
    href: string;
};

export default function HorizontalNavContainerNew({
    links,
}: {
    links: HorizontalNavLink[];
}) {
    const path = usePathname();

    return (
        <div className={styles.horizontal_nav_container}>
            {links.map((link) => {
                const isActive = link.href.includes(path);
                return (
                    <Link
                        href={link.href}
                        key={`hn${link.href}`}
                        className={
                            styles.link + " " + (isActive ? styles.active : "")
                        }
                    >
                        {link.name}
                    </Link>
                );
            })}
        </div>
    );
}
