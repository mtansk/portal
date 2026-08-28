"use client";

import { ApiResponse } from "@/app/server-actions/functions/types";
import useInfoPopover from "./useInfoPopover";
import refreshTokens from "@/app/server-actions/functions/refreshTokens";
import { useCallback } from "react";
import { InfoMessage } from "@/app/context/info/InfoMessage";

export function useServerAction() {
    const addPopoverMessage = useInfoPopover();

    const processAction = useCallback(
        async <T>({
            serverAction,
            showSuccess = false,
        }: {
            serverAction: () => Promise<ApiResponse<T>>;
            showSuccess?: boolean;
        }): Promise<ApiResponse<T> & { ok: boolean }> => {
            const res = await serverAction();

            if (!res || res.code === 401) {
                await refreshTokens();
                return await processAction({ serverAction, showSuccess });
            }

            handleResMessage(res, addPopoverMessage, showSuccess);

            return { ...res, ok: res.code > 199 && res.code < 300 };
        },
        [addPopoverMessage],
    );

    return processAction;
}

function handleResMessage(
    res: ApiResponse<unknown>,
    addPopoverMessage: (message: Partial<InfoMessage>) => void,
    showSuccess: boolean,
) {
    if (res.code > 199 && res.code < 300) {
        if (showSuccess) {
            addPopoverMessage({
                type: "success",
                message: "Успешно!",
                code: res.code,
            });
        }
    } else {
        switch (res.code) {
            case 401:
                addPopoverMessage({
                    type: "error",
                    code: res.code,
                    message: "Ошибка авторизации.",
                    error_code: res.error_code,
                    timing: 5000,
                });
                break;
            case 403:
                addPopoverMessage({
                    type: "error",
                    code: res.code,
                    message: "Ошибка доступа.",
                    error_code: res.error_code,
                    timing: 5000,
                });
                break;
            case 405:
                addPopoverMessage({
                    type: "error",
                    code: res.code,
                    message: "Ошибка метода.",
                    error_code: res.error_code,
                    timing: 5000,
                });
                break;
            case 422:
                addPopoverMessage({
                    type: "error",
                    code: res.code,
                    message: "Ошибка введенных данных.",
                    error_code: res.error_code,
                    timing: 5000,
                });
                break;
            case 429:
                addPopoverMessage({
                    type: "error",
                    code: res.code,
                    message: "Слишком много запросов. Попробуйте позже.",
                    error_code: res.error_code,
                    timing: 5000,
                });
            case 500:
                addPopoverMessage({
                    type: "error",
                    code: res.code,
                    message: "Ошибка сервера.",
                    error_code: res.error_code,
                    timing: 5000,
                });
                break;
            default:
                addPopoverMessage({
                    type: "error",
                    code: res.code,
                    message: "Неизвестная ошибка.",
                    error_code: res.error_code,
                    timing: 5000,
                });
                break;
        }
    }
}
