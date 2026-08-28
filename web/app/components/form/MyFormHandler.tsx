"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { FormButtonsNotation, FormButtons } from "./buttons/FormButtons";

import styles from "./../../css/form.module.scss";

type MyFormHandlerProps = {
    view: "modal" | "page";
    children: React.ReactNode;
    buttonsNotation?: FormButtonsNotation;
    setDialogIsOpen?: (dialogIsOpen: boolean) => void;
    title?: string;
};

export default function MyFormHandler({
    view,

    children,

    buttonsNotation,

    setDialogIsOpen,

    title,
}: MyFormHandlerProps) {
    const _backurl = useSearchParams().get("backurl") || "/company";

    function handleDialogClose() {
        if (view === "modal" && setDialogIsOpen) {
            setDialogIsOpen(false);
        }
    }

    function getDefaultNotation(): FormButtonsNotation {
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

    return (
        <form
            id="modal_form"
            onSubmit={(e) => {
                e.preventDefault();
            }}
            className={styles.modal_form}
        >
            <fieldset
                style={{
                    display: "contents",
                }}
                disabled={false}
            >
                <div className={styles.form_handler}>
                    {title && <div className={styles.form_title}>{title}</div>}
                    {children}
                    <div className={styles.form_buttons}>
                        <Suspense>
                            <FormButtons
                                notation={
                                    buttonsNotation ?? getDefaultNotation()
                                }
                                isPending={false}
                                isValid={false}
                            />
                        </Suspense>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}
