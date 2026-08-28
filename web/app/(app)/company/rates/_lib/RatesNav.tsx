import HorizontalNavContainerNew from "@/app/components/horizontal-nav-new/HorizontalNavContainerNew";

export default function RatesNav() {
    return (
        <HorizontalNavContainerNew
            links={[
                {
                    href: "/company/rates/general-rates",
                    name: "Для начислений",
                },
                {
                    href: "/company/rates/sheet-rates",
                    name: "Для смен",
                },
            ]}
        />
    );
}
