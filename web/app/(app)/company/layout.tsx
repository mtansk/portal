import SideNavContainerNew, {
    SideNavLinkProps,
} from "@/app/components/sidebar-nav-new/SideNavContainerNew";

export default async function CompanyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links: SideNavLinkProps[] = [
        { href: "/company/subscription", icon: "savings", title: "Подписка" },
        { href: "/company/downloads", icon: "download", title: "Загрузки" },

        { href: "/company/departments", icon: "circles_ext", title: "Отделы" },
        {
            href: "/company/rates",
            icon: "currency_ruble",
            title: "Ставки опл. труда",
        },
        {
            href: "/company/default-sheets",
            icon: "event_note",
            title: "Шаблоны смен",
        },
    ];
    return (
        <SideNavContainerNew
            links={links}
            header="Компания"
        >
            {children}
        </SideNavContainerNew>
    );
}

/* 
    Не создан
        
        создать


    Приглашен


*/
