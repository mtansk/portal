"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense, use } from "react";

import { ActionTypes } from "../hooks/useFormHandler";

import useBackURL from "../hooks/useBackURL";
import {
    FormButtonsNotation,
    FormButtonProps,
    FormButtons,
} from "./buttons/FormButtons";
import FormDeleteDialog from "./delete-dialog/FormDeleteDialog";
import { useServerAction } from "../hooks/useServerAction";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { ClientAccessStateContext } from "@/app/context/auth/ClientAccessStateContext";

import styles from "./../../css/form.module.scss";
/* 



*/

export type FormPathOptions = {
    detailsOnEdit?: boolean;
    id?: string | number;
    detailsOnAdd?: boolean;
    redirectOnAdd?: boolean;
    pathForAddRedirect?: string;
    basePath?: string;
    params?: string;
};

export type FormHandlerActions = {
    postAction?: () => Promise<ApiResponse<unknown>>;
    putAction?: () => Promise<ApiResponse<unknown>>;
    deleteAction?: () => Promise<ApiResponse<unknown>>;
};

export type DeleteDialogOptions = {
    deleteDialogText?: React.ReactNode;
    isDisabled?: boolean;
};

type FormHandlerProps<TO> = {
    view: "modal" | "page";

    object: TO;
    children: React.ReactNode;

    actionType: ActionTypes;
    setActionType: (actionType: ActionTypes) => void;

    actions?: FormHandlerActions;
    buttonsNotation?: FormButtonsNotation;
    deleteDialogOptions?: DeleteDialogOptions;

    setDialogIsOpen?: (dialogIsOpen: boolean) => void;

    pathOptions?: FormPathOptions;
    title?: string;

    after?: () => void | (() => () => void);
    onActionSuccess?: () => void;
};

/* 
 


*/

export default function FormHandler<TO>({
    view,

    object,
    children,

    actionType,
    setActionType,

    actions,
    buttonsNotation,
    deleteDialogOptions,

    setDialogIsOpen,

    pathOptions,
    title,

    after,
    onActionSuccess,
}: FormHandlerProps<TO>) {
    /*  */
    const formRef = useRef<HTMLFormElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);

    function getInitialValidity() {
        if (!formRef?.current) return false;
        return formRef.current.checkValidity();
    }

    const [valid, setValid] = useState(getInitialValidity);
    const [isPending, setIsPending] = useState(false);
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const accessState = use(ClientAccessStateContext);

    const serverAction = useServerAction();

    const _backurl = useSearchParams().get("backurl") || "/company";

    const router = useRouter();
    const currentPath = useBackURL();

    useEffect(() => {
        setValid(formRef?.current?.checkValidity() || false);
        /*       setIsPending(false); */
    }, [object]);

    const { putAction, deleteAction, postAction } = actions || {};

    async function handleSaveClick() {
        if (!putAction) return;
        setIsPending(true);
        setActionType("view");
        const afterCleanup = after?.();

        const res = await serverAction({
            serverAction: putAction,
            showSuccess: true,
        });

        if (res?.ok) {
            onActionSuccess?.();
        } else {
            afterCleanup?.();
            setActionType("edit");
        }
        setIsPending(false);
    }

    async function handleAddSaveClick() {
        if (!postAction) return;
        setIsPending(true);
        setActionType("view");
        const afterCleanup = after?.();

        const res = await serverAction({
            serverAction: postAction,
            showSuccess: true,
        });

        if (res?.ok) {
            if (view === "modal") {
                handleDialogClose();
            } else {
                if (pathOptions?.redirectOnAdd) {
                    router.replace(
                        pathOptions?.pathForAddRedirect ||
                            _backurl ||
                            "/company",
                    );
                }
            }
        } else {
            afterCleanup?.();
            setActionType("add");
        }
        setIsPending(false);
    }

    async function handleDeleteSaveClick() {
        if (!deleteAction) return;

        setIsPending(true);
        setActionType("view");
        const afterCleanup = after?.();

        const res = await serverAction({
            serverAction: deleteAction,
            showSuccess: true,
        });

        if (res?.ok) {
            if (view === "modal") {
                handleDialogClose();
            } else {
                router.replace(_backurl || "/company");
            }
        } else {
            setActionType("edit");
            afterCleanup?.();
        }
        setIsPending(false);
    }

    function handleDialogClose() {
        if (view === "modal" && setDialogIsOpen) {
            setDialogIsOpen(false);
        }
    }

    const detailsOnEditPath =
        (pathOptions &&
            pathOptions.detailsOnEdit &&
            pathOptions.id &&
            `${pathOptions.basePath}/${pathOptions.id}?backurl=
			${currentPath}&${pathOptions.params || ""}`) ||
        "/nodetailsoneditpath";

    const detailsOnAddPath =
        (pathOptions &&
            pathOptions.detailsOnAdd &&
            `${pathOptions.basePath}/add?backurl=${currentPath}&${pathOptions.params || ""}`) ||
        "/nodetailsonaddpath";

    function getDefaultNotation(): FormButtonsNotation {
        if (accessState.state.accessLevel === "employee") {
            return {
                right: [
                    view === "modal" ?
                        {
                            text: "Закрыть",
                            style: "g",
                            onClick: handleDialogClose,
                        }
                    :   {
                            text: "Назад",
                            style: "g",
                            href: _backurl || "/my/profile",
                        },
                ],
            };
        }

        const addLeft: FormButtonProps[] =
            pathOptions?.detailsOnAdd && view === "modal" ?
                [
                    {
                        text: "Еще",
                        style: "ne",
                        href: detailsOnAddPath,
                    },
                ]
            :   [];

        if (actionType === "add") {
            return {
                left: addLeft,
                right: [
                    view === "modal" ?
                        {
                            text: "Выйти",
                            style: "ne",
                            onClick: handleDialogClose,
                        }
                    :   {
                            text: "Выйти",
                            style: "ne",
                            href: _backurl || "/company",
                        },
                    {
                        text: "Добавить",
                        style: "g",
                        disabled: !valid,
                        onClick: handleAddSaveClick,
                    },
                ],
            };
        }

        if (actionType === "view") {
            return {
                left:
                    pathOptions?.detailsOnEdit && view === "modal" ?
                        [
                            {
                                text: "Еще",
                                style: "ne",
                                href: detailsOnEditPath,
                            },
                        ]
                    :   [],
                right: [
                    {
                        text: "Изменить",
                        style: "ne",
                        onClick: () => setActionType("edit"),
                    },
                    view === "modal" ?
                        {
                            text: "Закрыть",
                            style: "g",
                            onClick: handleDialogClose,
                        }
                    :   {
                            text: "Назад",
                            style: "g",
                            href: _backurl || "/company",
                        },
                ],
            };
        }

        if (actionType === "edit") {
            return {
                left: [
                    {
                        text: "Удалить",
                        style: "delete",
                        onClick: () => setDeleteDialogIsOpen(true),
                    },
                ],
                right: [
                    {
                        text: "Отмена",
                        style: "ne",
                        onClick: () => setActionType("restore"),
                    },
                    {
                        text: "Сохранить",
                        style: "g",
                        disabled: !valid,
                        onClick: handleSaveClick,
                    },
                ],
            };
        }

        return {
            left: [],
            right: [],
        };
    }

    return (
        <form
            id="modal_form"
            onSubmit={(e) => {
                e.preventDefault();
            }}
            className={styles.modal_form}
            ref={formRef}
            onChange={() =>
                setValid(formRef?.current?.checkValidity() || false)
            }
        >
            <fieldset
                style={{
                    display: "contents",
                }}
                disabled={isPending}
            >
                <div className={styles.form_handler}>
                    {title && <div className={styles.form_title}>{title}</div>}
                    {children}
                    {deleteDialogIsOpen && (
                        <FormDeleteDialog
                            dialogIsOpen={deleteDialogIsOpen}
                            setDialogIsOpen={setDeleteDialogIsOpen}
                            onDeleteClick={handleDeleteSaveClick}
                            options={deleteDialogOptions}
                        />
                    )}
                    <div className={styles.form_buttons}>
                        <Suspense>
                            <FormButtons
                                notation={
                                    buttonsNotation ?? getDefaultNotation()
                                }
                                isPending={isPending}
                                isValid={valid}
                            />
                        </Suspense>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}
