"use client";

import { ReactNode, createContext, useState } from "react";

export type InfoMessage = {
    type: "error" | "info" | "success";
    id: string;
    timestamp: number;
    code?: number;
    message: string;
    error_code?: string;
    timing?: number;
};

type ErrorContextProps = {
    infoMessages?: InfoMessage[];
    setInfoMessages: React.Dispatch<
        React.SetStateAction<InfoMessage[] | undefined>
    >;
};

export const InfoMessageContext = createContext<ErrorContextProps | undefined>(
    undefined,
);

export default function InfoMessageProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [infoMessages, setInfoMessages] = useState<InfoMessage[] | undefined>(
        undefined,
    );

    return (
        <InfoMessageContext value={{ infoMessages, setInfoMessages }}>
            {children}
        </InfoMessageContext>
    );
}
