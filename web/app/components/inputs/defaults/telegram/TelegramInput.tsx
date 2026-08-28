import InputWrapper from "../../wrapper/InputWrapper";
import styles from "./email.module.scss";

export default function TelegramInput({
    value,
    onChange,

    isDisabled = false,
    required = false,

    className,
}: {
    value: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    isDisabled?: boolean;
    required?: boolean;
    className?: string;
}) {
    return (
        <InputWrapper
            isDisabled={isDisabled}
            required={required}
            label="Телеграм"
            id="user_telegram"
            className={className}
        >
            <input
                type="text"
                value={value || ""}
                onChange={onChange}
                name="user_telegram"
                id="user_telegram"
                disabled={isDisabled}
                maxLength={30}
                placeholder="-"
                className={styles.input}
            />
        </InputWrapper>
    );
}
