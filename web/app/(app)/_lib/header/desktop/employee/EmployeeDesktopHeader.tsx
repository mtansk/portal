"use client";

import { Link } from "react-transition-progress/next";
import styles from "./admin-header.module.scss";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { EmployeeHeaderMenu } from "./EmployeeHeaderMenu";
import { HeaderLink } from "../_lib/header-link/HeaderLink";

export default function EmployeeDesktopHeader() {
    const [showMenu, setShowMenu] = useState(false);

    const path = usePathname();

    return (
        <div className={styles.header_div}>
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
                {showMenu && <EmployeeHeaderMenu path={path} />}
                <div className={styles.links_div}>
                    <HeaderLink
                        title="Зарплата"
                        href="/my/finance"
                        pathname={path}
                    />
                    <HeaderLink
                        title="График"
                        href="/my/schedule"
                        pathname={path}
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
