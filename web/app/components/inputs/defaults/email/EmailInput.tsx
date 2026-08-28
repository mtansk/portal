import InputWrapper from "../../wrapper/InputWrapper";
import styles from "./email.module.scss";

export default function EmailInput({
    value,
    onChange,

    isDisabled = false,
    required = true,
    className,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    isDisabled?: boolean;
    required?: boolean;
    className?: string;
}) {
    return (
        <InputWrapper
            isDisabled={isDisabled}
            required={required}
            label="Почта"
            id="user_email"
            className={className}
        >
            <input
                type="email"
                value={value}
                onChange={onChange}
                name="user_email"
                id="user_email"
                disabled={isDisabled}
                maxLength={30}
                placeholder="mail@example.com"
                required={required}
                className={styles.input}
            />
        </InputWrapper>
    );
}
