import { DesktopMenuColumn } from "../_lib/menu-column/DesktopMenuColumn";
import styles from "./menu.module.scss";

export function EmployeeHeaderMenu({ path }: { path: string }) {
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
            <DesktopMenuColumn
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
        </div>
    );
}
