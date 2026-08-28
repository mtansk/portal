"use client";

import { Link } from "react-transition-progress/next";
import styles from "./default-buttons.module.scss";

export type ButtonProps = {
    isDisabled?: boolean;
    isPending?: boolean;

    onClick?: () => void;
    href?: string;
    prefetch?: boolean;

    innerContent: React.ReactNode;
    className?: string;

    type?: "bold" | "filled" | "nav";
    colors?:
        | "submit-gray"
        | "filled-gray"
        | "bold-blue"
        | "bold-red"
        | "nav-blue"
        | "nav-purple"
        | "buy-pink"
        | "buy-pink-anim";
};

export function Button({
    isDisabled = false,
    isPending = false,

    onClick,
    href,
    prefetch,

    innerContent,
    className,

    type,
    colors,
}: ButtonProps) {
    if (isPending) {
        return <ButtonSpinner />;
    }

    const button = (
        <button
            type={colors === "submit-gray" ? "submit" : "button"}
            className={`${styles[type || ""]} ${styles[colors || ""]} ${className}`}
            disabled={isDisabled}
            onClick={(e) => {
                e.preventDefault();
                onClick?.();
            }}
        >
            {innerContent}
        </button>
    );

    if (href) {
        return (
            <Link
                href={href}
                prefetch={prefetch}
            >
                {button}
            </Link>
        );
    }

    return button;
}

function ButtonSpinner() {
    return <div className={styles.spinner}></div>;
}

export function DeleteIconButton({
    isDisabled = false,
    onClick,

    className,
}: ButtonProps) {
    return (
        <button
            type="button"
            className={`${styles.delete_button} ${className}`}
            disabled={isDisabled}
            onClick={onClick}
        >
            <div className={"icon " + styles.icon}>delete_forever</div>
        </button>
    );
}
