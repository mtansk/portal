import InputWrapper from "../../wrapper/InputWrapper";
import styles from "./first-name.module.scss";

export default function FirstNameInput({
    value,
    onChange,

    isDisabled = false,
    className,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    isDisabled?: boolean;
    className?: string;
}) {
    return (
        <InputWrapper
            isDisabled={isDisabled}
            required={true}
            label="Имя"
            id="first_name"
            className={className}
        >
            <input
                type="text"
                value={value}
                onChange={onChange}
                name="first_name"
                id="first_name"
                disabled={isDisabled}
                maxLength={30}
                required={true}
                placeholder="Имя"
                className={styles.input}
            />
        </InputWrapper>
    );
}
