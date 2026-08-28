import SideNavContainerNew, {
    SideNavLinkProps,
} from "@/app/components/sidebar-nav-new/SideNavContainerNew";

export default async function CompanyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links: SideNavLinkProps[] = [
        { href: "/users/list", icon: "list", title: "Список" },
        { href: "/users/accounts", icon: "account_circle", title: "Аккаунты" },
        {
            href: "/users/deleted",
            icon: "delete",
            title: "Корзина",
        },
    ];
    return (
        <SideNavContainerNew
            links={links}
            header="Сотрудники"
        >
            {children}
        </SideNavContainerNew>
    );
    /*     return <SideNavContainer links={links}>{children}</SideNavContainer>; */
}

/* 
    Не создан
        
        создать


    Приглашен


*/
