"use client";

import {
    AuthorizationPayload,
    ClientAccessState,
} from "@/app/types/access/Access";
import { createContext, useMemo, useState } from "react";

type ClientAccessStateContextType = {
    state: ClientAccessState;
    setter: React.Dispatch<React.SetStateAction<ClientAccessState>>;
};

export const ClientAccessStateContext =
    createContext<ClientAccessStateContextType>({
        state: {
            accessLevel: "guest",
            accessState: "none",
            accountId: "",
            companyId: "",
            userId: "",
        },
        setter: () => {},
    });

export default function ClientAccessStateProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [clientAccessState, setClientAccessState] =
        useState<ClientAccessState>({
            accessLevel: "guest",
            accessState: "none",
            accountId: "",
            companyId: "",
            userId: "",
        });

    const value = useMemo(
        () => ({ state: clientAccessState, setter: setClientAccessState }),
        [clientAccessState],
    );

    return (
        <ClientAccessStateContext value={value}>
            {children}
        </ClientAccessStateContext>
    );
}

export function changeAccessContextWithAuthPayload(
    payload: AuthorizationPayload,
    setter: React.Dispatch<React.SetStateAction<ClientAccessState>>,
) {
    setter({
        accessLevel: payload.access_level,
        accessState: payload.access_state,
        accountId: payload.account_id,
        companyId: payload.company_id,
        userId: payload.user_id,
    });
}
