import InputWrapper from "../../wrapper/InputWrapper";
import styles from "./desc.module.scss";

export function DescInput({
    value,
    onChange,

    isDisabled,
    name,
    headerLike,
}: {
    value: string | null | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    isDisabled: boolean;
    name?: string;
    headerLike?: boolean;
}) {
    return (
        <InputWrapper
            isDisabled={isDisabled}
            required={false}
            label="Описание"
            lengthOptions={{ max: 255, current: value ? value.length : 0 }}
            id="default-desc-input"
            headerLike={headerLike !== undefined ? headerLike : false}
        >
            <textarea
                value={value === undefined || value === null ? "" : value}
                disabled={isDisabled}
                name={name || "desc"}
                onChange={(e) => onChange(e)}
                placeholder="Укажите описание"
                required={false}
                maxLength={255}
                id="default-desc-input"
                className={styles.textarea}
            />
        </InputWrapper>
    );
}
