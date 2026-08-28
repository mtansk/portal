import Spinner from "../../loading/spinner/Spinner";

import buttonStyles from "./form-buttons.module.scss";
import { memo } from "react";
import { Button, ButtonProps, DeleteIconButton } from "../../buttons/Buttons";

export type FormButtonProps = {
    text: string;
    style: "g" | "ne" | "b" | "delete" | undefined;
    disabled?: boolean;
    disabledByForm?: boolean;
    onClick?: () => void;
    className?: string;
    href?: string;
};

export type FormButtonsNotation = {
    left?: FormButtonProps[];
    right?: FormButtonProps[];
};

export const FormButtons = memo(function FormButtons({
    notation,
    isPending,
    isValid,
}: {
    notation: FormButtonsNotation;
    isPending?: boolean;
    isValid?: boolean;
}) {
    if (isPending) {
        return (
            <div className={buttonStyles.button_div}>
                <div className={buttonStyles.left_div}></div>
                <div className={buttonStyles.right_div}>
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <div className={buttonStyles.button_div}>
            <div className={buttonStyles.left_div}>
                {notation.left?.map((buttonProps, index) => (
                    <FormButton
                        key={`left-button-${index}`}
                        {...buttonProps}
                    />
                ))}
            </div>
            <div className={buttonStyles.right_div}>
                {notation.right?.map((buttonProps, index) => (
                    <FormButton
                        key={`right-button-${index}`}
                        {...buttonProps}
                        disabled={
                            buttonProps.disabledByForm ? !isValid : (
                                buttonProps.disabled
                            )
                        }
                    />
                ))}
            </div>
        </div>
    );
});

function FormButton({
    text,
    style,
    disabled = false,
    onClick,
    className,
    href,
}: FormButtonProps) {
    const props: ButtonProps = {
        innerContent: text,
        className: className,
        href: href,
        isDisabled: disabled,
        onClick: onClick,
    };

    if (style === "g") {
        return (
            <Button
                {...props}
                type="filled"
                colors="submit-gray"
            />
        );
    }

    if (style === "ne") {
        return (
            <Button
                {...props}
                type="filled"
                colors="filled-gray"
            />
        );
    }

    if (style === "b") {
        return (
            <Button
                {...props}
                type="bold"
                colors="bold-red"
            />
        );
    }

    if (style === "delete") {
        return <DeleteIconButton {...props} />;
    }
}
