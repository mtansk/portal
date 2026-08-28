"use client";

import { use, useEffect, useRef } from "react";
import {
    InfoMessage,
    InfoMessageContext,
} from "../../context/info/InfoMessage";

import styles from "./popover.module.scss";

export default function InfoPopoverLayer() {
    const { infoMessages, setInfoMessages } = use(InfoMessageContext) || {};

    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (popoverRef?.current && "showPopover" in popoverRef?.current) {
            popoverRef.current?.hidePopover();
            if (infoMessages?.length && setInfoMessages && popoverRef.current) {
                popoverRef.current?.showPopover();
            } else {
                popoverRef.current?.hidePopover();
            }
        }
    }, [infoMessages, setInfoMessages]);

    if (infoMessages?.length === 0 || !infoMessages) {
        if (popoverRef?.current && "showPopover" in popoverRef?.current) {
            popoverRef.current?.hidePopover();
        }
        return null;
    }

    const sortedMessages = infoMessages?.sort(
        (a, b) => a.timestamp - b.timestamp,
    );

    return (
        <div
            className={styles.popovers_container}
            ref={popoverRef}
            popover="manual"
        >
            {sortedMessages?.map((infoMessage) => (
                <InfoPopover
                    key={infoMessage.id}
                    infoMessage={infoMessage}
                    setInfoMessages={setInfoMessages}
                />
            ))}
        </div>
    );
}

function InfoPopover({
    infoMessage,
    setInfoMessages,
}: {
    infoMessage: InfoMessage;
    setInfoMessages:
        | React.Dispatch<React.SetStateAction<InfoMessage[] | undefined>>
        | undefined;
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            setInfoMessages?.((prev) => {
                if (prev) {
                    return prev.filter((msg) => msg.id !== infoMessage.id);
                }
                return [];
            });
        }, infoMessage.timing || 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [setInfoMessages, infoMessage.id, infoMessage.timing]);

    return (
        <div
            className={
                styles.popover_div +
                " " +
                styles[infoMessage.type] +
                " " +
                styles.visible
            }
        >
            <div className={styles.code}>
                {infoMessage.type === "error" ? infoMessage.code : ""}
            </div>
            <div className={styles.header}>
                {infoMessage.type === "error" && "Ошибка!"}
            </div>
            <div className={styles.body}>
                <div className={styles.message}>{infoMessage.message}</div>
                {infoMessage.type === "error" && (
                    <div className={styles.footer}>
                        <span>{`Код: ${infoMessage.error_code || ""}. Пожалуйста, сделайте скриншот и напишите в поддержку.`}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
