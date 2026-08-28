import SideNavContainerNew, {
    SideNavLinkProps,
} from "@/app/components/sidebar-nav-new/SideNavContainerNew";

export const experimental_ppr = true;

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links: SideNavLinkProps[] = [
        {
            title: "Календарь",
            href: "/finance-calendar",
            icon: "calendar_month",
        },
        {
            title: "Начисления",
            href: "/finance/accruals/",
            icon: "add",
            useParams: true,
        },
        {
            title: "Удержания",
            href: "/finance/reductions/",
            icon: "remove",
            useParams: true,
        },
        {
            title: "Выплаты",
            href: "/finance/payments/",
            icon: "keyboard_double_arrow_up",
            useParams: true,
        },
        {
            title: "Расчетные листы",
            href: "/finance/payslips",
            icon: "checkbook",
            useParams: true,
        },
        {
            title: "Долги",
            href: "/finance/debts",
            icon: "account_balance",
        },
    ];

    return (
        <SideNavContainerNew
            links={links}
            header="Зарплата"
        >
            {children}
        </SideNavContainerNew>
    );

    /*     return <SideNavContainer links={links}>{children}</SideNavContainer>; */
}
