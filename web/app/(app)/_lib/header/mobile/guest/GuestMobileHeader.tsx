"use client";

import styles from "./../_lib/css/mobile-header.module.scss";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GuestMobileMenu } from "./GuestMobileMenu";
import { HeaderLink } from "../../desktop/_lib/header-link/HeaderLink";

export default function GuestMobileHeader() {
    const [showMenu, setShowMenu] = useState(false);

    const path = usePathname();

    return (
        <div className={styles.header_div}>
            <nav className={styles.main_div}>
                <div className={styles.account_div}></div>
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
                {showMenu && (
                    <GuestMobileMenu
                        path={path}
                        setShowMenu={setShowMenu}
                    />
                )}

                <div className={styles.links_div}>
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
