"use client";

import styles from "./admin-header.module.scss";
import { Link } from "react-transition-progress/next";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminHeaderMenu } from "./AdminHeaderMenu";
import { HeaderLink } from "../_lib/header-link/HeaderLink";

export default function AdminDesktopHeader() {
    const [showMenu, setShowMenu] = useState(false);

    const path = usePathname();

    const isDark = false;

    return (
        <div className={styles.header_div + " " + (isDark ? styles.dark : "")}>
            <nav
                className={styles.main_div}
                onMouseLeave={() => {
                    if (!showMenu) return;
                    setShowMenu(false);
                }}
            >
                <div className={styles.menu_div}>
                    <button
                        type="button"
                        className={styles.menu_button}
                        onMouseOver={() => {
                            if (showMenu) return;
                            setShowMenu(true);
                        }}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <div className={styles.menu_button_text}>Меню</div>
                        <div className={"icon " + styles.menu_icon}>
                            widgets
                        </div>
                    </button>
                    <div className={styles.stripe}></div>
                </div>
                {showMenu && <AdminHeaderMenu path={path} />}
                <div className={styles.links_div}>
                    <HeaderLink
                        title="Зарплата"
                        href="/finance"
                        pathname={path}
                    />
                    <HeaderLink
                        title="График"
                        href="/schedule"
                        pathname={path}
                    />
                    <HeaderLink
                        title="Сотрудники"
                        href="/users"
                        pathname={path}
                        className="hides_after_42rem_do_not_change"
                    />
                    <HeaderLink
                        title="Компания"
                        href="/company"
                        pathname={path}
                        className="hides_after_42rem_do_not_change"
                    />
                </div>
                <div className={styles.account_div}>
                    <Link
                        className={styles.account_button}
                        href={"/my/profile"}
                    >
                        <div className={"icon " + styles.account_icon}>
                            account_circle
                        </div>
                        <div className={styles.account_text}>Аккаунт</div>
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export function EmptyHeaderDiv() {
    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}></div>
        </div>
    );
}
