import InputWrapper from "../../wrapper/InputWrapper";
import styles from "./name.module.scss";

export function NameInput({
    value,
    onChange,

    isDisabled,
    headerLike = false,
    name,
    className,
}: {
    value: string | null | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    isDisabled: boolean;
    headerLike?: boolean;
    name?: string;
    className?: string;
}) {
    return (
        <InputWrapper
            isDisabled={isDisabled}
            required={true}
            label="Название"
            lengthOptions={{ max: 100, current: value ? value.length : 0 }}
            id="default-name-input"
            headerLike={headerLike}
            className={className}
        >
            <textarea
                value={value === undefined || value === null ? "" : value}
                disabled={isDisabled}
                name={name || "name"}
                onChange={(e) => {
                    onChange(e);
                }}
                placeholder="Укажите название"
                required={true}
                maxLength={100}
                id="default-name-input"
                className={styles.textarea}
            />
        </InputWrapper>
    );
}
