import MobileMenuColumn from "../_lib/menu-column/MobileMenuColumn";
import columnStyles from "./../_lib/menu-column/column.module.scss";
import styles from "./../_lib/css/mobile-menu.module.scss";

export function GuestMobileMenu({
    path,
    setShowMenu,
}: {
    path: string;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <>
            <div
                className={styles.header_menu}
                onClick={() => setShowMenu(false)}
            >
                <MobileMenuColumn
                    path={path}
                    header={{
                        title: "Вход",
                        href: "/auth/login",
                    }}
                    links={[]}
                />
                <MobileMenuColumn
                    path={path}
                    header={{
                        title: "Регистрация",
                        href: "/auth/reg",
                    }}
                    links={[
                        {
                            title: "Компания",
                            href: "/auth/reg/company",
                            icon: "",
                        },
                        {
                            title: "Сотрудник",
                            href: "/auth/reg/user",
                            icon: "",
                        },
                    ]}
                />
                <div className={columnStyles.menu_column}></div>
                <MobileMenuColumn
                    header={{
                        title: "Портал",
                        href: "/pub/hello",
                    }}
                    links={[
                        {
                            title: "Привет!",
                            href: "/pub/hello",
                            icon: "",
                        },
                        {
                            title: "Цены",
                            href: "/pub/prices",
                            icon: "",
                        },
                        {
                            title: "Руководства",
                            href: "/pub/docs",
                            icon: "",
                        },
                        {
                            title: "Поддержка",
                            href: "/pub/support",
                            icon: "",
                        },
                    ]}
                    path={path}
                />
            </div>
            <div
                className={styles.backdrop}
                onClick={() => setShowMenu(false)}
            ></div>
        </>
    );
}
