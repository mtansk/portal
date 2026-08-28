import MobileMenuColumn from "../_lib/menu-column/MobileMenuColumn";
import SwitchMenuButton from "../_lib/switch-button/SwitchMenuButton";
import styles from "./../_lib/css/mobile-menu.module.scss";

export function AdminMobileMenu({
    path,
    setShowMenu,
    setIsAdminMenu,
}: {
    path: string;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAdminMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <>
            <div
                className={styles.header_menu}
                onClick={() => setShowMenu(false)}
            >
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
                        /*     {
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
                <MobileMenuColumn
                    path={path}
                    header={{
                        title: "Сотрудники",
                        href: "/users",
                    }}
                    links={[
                        {
                            title: "Список",
                            href: "/users/list",
                            icon: "",
                        },
                        {
                            title: "Аккаунты",
                            href: "/users/accounts",
                            icon: "",
                        },
                        {
                            title: "Корзина",
                            href: "/users/deleted",
                            icon: "",
                        },
                    ]}
                />
                <MobileMenuColumn
                    path={path}
                    header={{
                        title: "Зарплата",
                        href: "/finance",
                    }}
                    links={[
                        {
                            title: "Начисления",
                            href: "/finance/accruals",
                            icon: "",
                        },
                        {
                            title: "Удержания",
                            href: "/finance/reductions",
                            icon: "",
                        },
                        {
                            title: "Выплаты",
                            href: "/finance/payments",
                            icon: "",
                        },
                        {
                            title: "Расчетные листы",
                            href: "/finance/payslips",
                            icon: "",
                        },
                        /*    {
                            title: "Задолженности",
                            href: "/finance/debts",
                            icon: "",
                        }, */
                    ]}
                />

                <MobileMenuColumn
                    path={path}
                    header={{
                        title: "Компания",
                        href: "/company",
                    }}
                    links={[
                        {
                            title: "Подписка",
                            href: "/company/subscription",
                            icon: "",
                        },
                        /*    {
                            title: "Загрузки",
                            href: "/company/downloads",
                            icon: "",
                        }, */
                        {
                            title: "Отделы",
                            href: "/company/departments",
                            icon: "",
                        },
                        {
                            title: "Ставки",
                            href: "/company/rates",
                            icon: "",
                        },
                        {
                            title: "Шаблоны смен",
                            href: "/company/default-sheets",
                            icon: "",
                        },
                    ]}
                />
                <MobileMenuColumn
                    path={path}
                    header={{
                        title: "График",
                        href: "/schedule",
                    }}
                    links={[
                        {
                            title: "Смены",
                            href: "/schedule",
                            icon: "",
                        },
                    ]}
                />

                <SwitchMenuButton
                    setIsAdminMenu={setIsAdminMenu}
                    isAdminMenu={true}
                />
            </div>
            <div
                className={styles.backdrop}
                onClick={() => setShowMenu(false)}
            ></div>
        </>
    );
}
