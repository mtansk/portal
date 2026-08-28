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
            title: "Обзор",
            href: "/my/finance/overview",
            icon: "donut_large",
            useParams: true,
        },
        {
            title: "Расчетные листы",
            href: "/my/finance/payslips",
            icon: "checkbook",
            useParams: true,
        },
        {
            title: "Долги",
            href: "/my/finance/debts",
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
}
