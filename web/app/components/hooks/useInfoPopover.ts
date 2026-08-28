import { use, useCallback } from "react";
import {
    InfoMessage,
    InfoMessageContext,
} from "../../context/info/InfoMessage";

export default function useInfoPopover() {
    const { setInfoMessages } = use(InfoMessageContext) || {};

    const addPopoverMessage = useCallback(
        function _addPopoverMessage(infoMessage: Partial<InfoMessage>) {
            const _id = Math.random().toString(36).substring(7);

            const messageObject: InfoMessage = {
                type: infoMessage.type || "info",
                message: infoMessage.message || "",
                code: infoMessage.code,
                error_code: infoMessage.error_code,
                timing: infoMessage.timing,
                timestamp: Date.now(),
                id: _id,
            };

            setInfoMessages?.((prev) => {
                if (prev) {
                    return [...prev, messageObject];
                } else {
                    return [messageObject];
                }
            });
        },
        [setInfoMessages],
    );

    return addPopoverMessage;
}
