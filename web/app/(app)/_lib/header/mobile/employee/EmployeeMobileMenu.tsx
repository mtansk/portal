import MobileMenuColumn from "../_lib/menu-column/MobileMenuColumn";
import SwitchMenuButton from "../_lib/switch-button/SwitchMenuButton";
import styles from "./../_lib/css/mobile-menu.module.scss";

export function EmployeeMobileMenu({
    path,
    setShowMenu,
    setIsAdminMenu,
}: {
    path: string;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAdminMenu?: React.Dispatch<React.SetStateAction<boolean>>;
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
                        title: "Зарплата",
                        href: "/my/finance",
                    }}
                    links={[
                        {
                            title: "Обзор",
                            href: "/my/finance/overview",
                            icon: "",
                        },
                        {
                            title: "Расчетные листы",
                            href: "/my/finance/payslips",
                            icon: "",
                        },
                        {
                            title: "Задолженности",
                            href: "/my/finance/debts",
                            icon: "",
                        },
                    ]}
                />

                <MobileMenuColumn
                    path={path}
                    header={{
                        title: "График",
                        href: "/my/schedule",
                    }}
                    links={[
                        {
                            title: "Мои смены",
                            href: "/my/schedule/my",
                            icon: "",
                        },
                        {
                            title: "Общий график",
                            href: "/my/schedule/team",
                            icon: "",
                        },
                    ]}
                />
                <MobileMenuColumn
                    header={{
                        title: "Портал",
                        href: "/pub/support",
                    }}
                    links={[
                        {
                            title: "Руководства",
                            href: "/pub/docs",
                            icon: "",
                        },
                        /*   {
                            title: "Документы",
                            href: "/pub/legal",
                            icon: "",
                        }, */
                        {
                            title: "Поддержка",
                            href: "/pub/support",
                            icon: "",
                        },
                        {
                            title: "Профиль",
                            href: "/my/profile",
                            icon: "",
                        },
                    ]}
                    path={path}
                />
                {setIsAdminMenu && (
                    <SwitchMenuButton
                        setIsAdminMenu={setIsAdminMenu}
                        isAdminMenu={false}
                    />
                )}
            </div>
            <div
                className={styles.backdrop}
                onClick={() => setShowMenu(false)}
            ></div>
        </>
    );
}
