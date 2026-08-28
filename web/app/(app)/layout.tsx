"use client";

import dynamic from "next/dynamic";
import InfoPopoverLayer from "../components/infoModal/InfoPopover";

const LazyHeader = dynamic(() => import("./_lib/header/Header"), {
    ssr: false,
    loading: () => <div className="header_loading_skeleton"></div>,
});

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <InfoPopoverLayer />
            <div className="main_layout_div">
                <LazyHeader />
                <div className="scrollable_main_div">{children}</div>
            </div>
        </>
    );
}
