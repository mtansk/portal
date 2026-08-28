"use client";

import { Link } from "react-transition-progress/next";
import { HeaderLink } from "../_lib/header-link/HeaderLink";
import styles from "./guest-header.module.scss";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "./../../../images/black-logo.png";

export default function GuestDesktopHeader() {
    const path = usePathname();

    return (
        <div className={styles.header_div}>
            <nav className={styles.main_div}>
                <Link
                    href={"/pub/hello"}
                    className={styles.logo_link}
                >
                    <Image
                        src={logo}
                        alt="logo"
                        className={styles.logo_image}
                    />
                </Link>
                <div className={styles.links_div}>
                    <HeaderLink
                        title="Привет!"
                        href="/pub/hello"
                        pathname={path}
                    />
                    <HeaderLink
                        title="Цены"
                        href="/pub/prices"
                        pathname={path}
                    />
                    <HeaderLink
                        title="Руководства"
                        href="/pub/docs"
                        pathname={path}
                        className="hides_after_42rem_do_not_change"
                    />
                    <HeaderLink
                        title="Поддержка"
                        href="/pub/support"
                        pathname={path}
                        className="hides_after_42rem_do_not_change"
                    />
                </div>
                <div className={styles.account_links_div}>
                    <HeaderLink
                        title="Вход"
                        href="/auth/login"
                        pathname={path}
                    />
                    <HeaderLink
                        title="Регистрация"
                        href="/auth/reg"
                        pathname={path}
                    />
                </div>
            </nav>
        </div>
    );
}
