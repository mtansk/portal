import { DesktopMenuColumn } from "../_lib/menu-column/DesktopMenuColumn";
import styles from "./menu.module.scss";

export function AdminHeaderMenu({ path }: { path: string }) {
    return (
        <div className={styles.header_menu}>
            <DesktopMenuColumn
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
                    {
                        title: "Документы",
                        href: "/pub/legal",
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
            <DesktopMenuColumn
                path={path}
                header={{
                    title: "Зарплата",
                    href: "/finance",
                }}
                links={[
                    {
                        title: "Календарь",
                        href: "/finance-calendar",
                        icon: "",
                    },
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
                    {
                        title: "Задолженности",
                        href: "/finance/debts",
                        icon: "",
                    },
                ]}
            />
            <DesktopMenuColumn
                path={path}
                header={{
                    title: "График",
                    href: "/schedule",
                }}
                links={[
                    {
                        title: "Мои смены",
                        href: "/my/schedule/my",
                        icon: "",
                    },
                    {
                        title: "Управление",
                        href: "/schedule",
                        icon: "",
                    },
                    {
                        title: "Моя зарплата",
                        href: "/my/finance/overview",
                        icon: "",
                    },
                    {
                        title: "Мои РЛ",
                        href: "/my/finance/payslips",
                        icon: "",
                    },
                    {
                        title: "Мои долги",
                        href: "/my/finance/debts",
                        icon: "",
                    },
                ]}
            />
            <DesktopMenuColumn
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
            <DesktopMenuColumn
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
                    {
                        title: "Загрузки",
                        href: "/company/downloads",
                        icon: "",
                    },
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
        </div>
    );
}
