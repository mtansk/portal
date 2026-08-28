"use client";

import { Link } from "react-transition-progress/next";
import styles from "./css/side-nav.module.scss";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SideNavContainerNew({
    children,
    links,
    header,
}: {
    children: React.ReactNode;
    links: SideNavLinkProps[];
    header: string;
}) {
    return (
        <div
            className={
                "do_not_change_main_container " + styles.side_nav_container
            }
        >
            <div className={styles.side_div}>
                <div className={styles.sticky_container}>
                    <div className={styles.header}>{header}</div>
                    <div className={styles.links_div}>
                        <Suspense>
                            {links.map((link, index) => (
                                <SidebarNavLink
                                    key={index}
                                    href={link.href}
                                    icon={link.icon}
                                    title={link.title}
                                    useParams={link.useParams}
                                />
                            ))}
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className={"do_not_change_main_body_div " + styles.body_div}>
                {children}
            </div>
        </div>
    );
}

export type SideNavLinkProps = {
    href: string;
    icon: string;
    title: string;
    useParams?: boolean;
};

export function SidebarNavLink({
    href,
    icon,
    title,
    useParams,
}: SideNavLinkProps) {
    const params = useSearchParams();
    const path = usePathname();

    return (
        <Link
            href={{
                pathname: href,
                query: useParams ? params.toString() : {},
            }}
            className={
                styles.link + " " + (path.includes(href) ? styles.active : "")
            }
        >
            <div className={"icon " + styles.link_icon}>{icon}</div>
            <div className={styles.link_title}>{title}</div>
        </Link>
    );
}
