"use client";

import { Link } from "react-transition-progress/next";
import styles from "./../_lib/css/mobile-header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { AdminMobileMenu } from "./AdminMobileMenu";
import { EmployeeMobileMenu } from "../employee/EmployeeMobileMenu";
import { HeaderLink } from "../../desktop/_lib/header-link/HeaderLink";
import { useProgress } from "react-transition-progress";

export default function AdminMobileHeader() {
    const [showMenu, setShowMenu] = useState(false);
    const [isAdminMenu, setIsAdminMenu] = useState(true);

    const path = usePathname();
    const router = useRouter();
    const startProgress = useProgress();

    return (
        <div className={styles.header_div}>
            <nav
                className={styles.main_div}
                onClick={() => {
                    if (!showMenu) return;
                    setShowMenu(false);
                }}
            >
                <div className={styles.account_div}>
                    <Link
                        href="/my/profile"
                        className={styles.account_button}
                    >
                        <div className={"icon " + styles.account_icon}>
                            account_circle
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            startTransition(() => {
                                startProgress();
                                router.refresh();
                            });
                        }}
                        className={styles.refresh}
                    >
                        <span className="icon">refresh</span>
                    </button>
                </div>
                <div className={styles.back}>
                    <button
                        type="button"
                        onClick={() => {
                            startTransition(() => {
                                startProgress();
                                router.back();
                            });
                        }}
                    >
                        <span className="icon">arrow_back_ios_new</span>
                    </button>
                </div>
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
                {showMenu && isAdminMenu && (
                    <AdminMobileMenu
                        path={path}
                        setShowMenu={setShowMenu}
                        setIsAdminMenu={setIsAdminMenu}
                    />
                )}
                {showMenu && !isAdminMenu && (
                    <EmployeeMobileMenu
                        path={path}
                        setShowMenu={setShowMenu}
                        setIsAdminMenu={setIsAdminMenu}
                    />
                )}
                <div className={styles.links_div}>
                    <HeaderLink
                        title="Зарплата"
                        href="/finance"
                        pathname={path}
                    />
                    <HeaderLink
                        title="График"
                        href="/my/schedule/my"
                        pathname={path}
                    />
                </div>
            </nav>
        </div>
    );
}
