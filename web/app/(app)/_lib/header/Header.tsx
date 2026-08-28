"use client";

import { use, useEffect } from "react";
import { ClientAccessStateContext } from "@/app/context/auth/ClientAccessStateContext";
import AdminDesktopHeader, {
    EmptyHeaderDiv,
} from "./desktop/admin/AdminDesktopHeader";
import GuestDesktopHeader from "./desktop/guest/GuestDesktopHeader";
import {
    isAccessLevelWithGuest,
    isAccessState,
} from "@/app/types/access/Access";
import { usePathname, useRouter } from "next/navigation";
import AdminMobileHeader from "./mobile/admin/AdminMobileHeader";
import EmployeeDesktopHeader from "./desktop/employee/EmployeeDesktopHeader";
import EmployeeMobileHeader from "./mobile/employee/EmployeeMobileHeader";
import GuestMobileHeader from "./mobile/guest/GuestMobileHeader";

declare const ym: ym.Event;

const getCookie = (name: string): string | null => {
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
};

export default function Header() {
    const clientAccessState = use(ClientAccessStateContext);
    const router = useRouter();
    const { state, setter } = clientAccessState;

    const path = usePathname();

    useEffect(() => {
        if ("ym" in window) {
            ym(100486848, "hit", path);
        }

        const accessLevelCookies = getCookie("access_level");
        const accessStateCookies = getCookie("access_state");
        const companyIdCookies = getCookie("company_id");
        const userIdCookies = getCookie("user_id");
        const accountIdCookies = getCookie("account_id");

        if (
            isAccessLevelWithGuest(accessLevelCookies) &&
            isAccessState(accessStateCookies)
        ) {
            setter({
                accessLevel: accessLevelCookies || "guest",
                accessState: accessStateCookies || "none",
                companyId: companyIdCookies || "",
                userId: userIdCookies || "",
                accountId: accountIdCookies || "",
            });
        }

        if (!CSS.supports("height: 100svh")) {
            router.replace("/pub/outdated");
        }
    }, [setter, path, router]);

    const viewportWidthPx = window.innerWidth;
    const viewportWidthRem =
        viewportWidthPx /
        parseFloat(window.getComputedStyle(document.documentElement).fontSize);

    const isMobile = viewportWidthRem < 32;

    if (!isMobile) {
        if (clientAccessState.state.accessLevel === "admin") {
            return <AdminDesktopHeader />;
        } else if (clientAccessState.state.accessLevel === "employee") {
            return <EmployeeDesktopHeader />;
        } else if (clientAccessState.state.accessLevel === "guest") {
            return <GuestDesktopHeader />;
        }
        return <GuestDesktopHeader />;
    }

    if (isMobile) {
        if (clientAccessState.state.accessLevel === "admin") {
            return <AdminMobileHeader />;
        } else if (clientAccessState.state.accessLevel === "employee") {
            return <EmployeeMobileHeader />;
        } else if (clientAccessState.state.accessLevel === "guest") {
            return <GuestMobileHeader />;
        }
        return <GuestMobileHeader />;
    }
    return <EmptyHeaderDiv />;
}
