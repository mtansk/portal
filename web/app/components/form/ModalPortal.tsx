"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ProgressBar from "../loading/progress-bar/ProgressBar";

export function ModalPortal({
    children,
    setDialogIsOpen,

    dialogIsOpen,
}: {
    children: React.ReactNode;
    setDialogIsOpen: (dialogIsOpen: boolean) => void;

    dialogIsOpen: boolean;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (dialogIsOpen) {
            dialogRef.current?.showModal();
            document.body.classList.add("no-scroll");
        }
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [dialogIsOpen]);

    function onDismiss() {
        dialogRef.current?.close();
        setDialogIsOpen(false);
    }

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if ((e.target as HTMLElement).tagName === "DIALOG") {
            e.stopPropagation();
            onDismiss();
        }
    }

    function preventAutoFocus() {
        closeButtonRef.current?.blur();
    }

    return createPortal(
        <div
            className="modal-backdrop"
            onMouseDown={handleBackdropClick}
        >
            <dialog
                ref={dialogRef}
                className="modal"
                onClose={onDismiss}
            >
                <ProgressBar />
                <button
                    onClick={onDismiss}
                    ref={closeButtonRef}
                    onFocus={preventAutoFocus}
                >
                    <div className="icon">close</div>
                </button>
                {children}
            </dialog>
        </div>,
        document.getElementById("modal-root")!,
    );
}
