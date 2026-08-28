"use client";

import { ClientAccessStateContext } from "./ClientAccessStateContext";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClientAccessState } from "@/app/types/access/Access";
import setLogoutCookies from "@/app/server-actions/auth/cookies/setLogoutCookies";

export default function ClientAccessStateChanger({
    state,
    redirectUrl,
}: {
    state: ClientAccessState;
    redirectUrl: string;
}) {
    const context = use(ClientAccessStateContext);
    const router = useRouter();

    useEffect(() => {
        context.setter(state);
        router.replace(redirectUrl);

        const handleCookies = async () => {
            await setLogoutCookies();
        };
        handleCookies();
    }, [context, state, router, redirectUrl]);

    return null;
}
