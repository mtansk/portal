import styles from "./checkbox.module.scss";

export default function CustomCheckbox({
    text,
    value,
    isDisabled,

    onChange,

    className,
}: {
    text: string;
    value: boolean;
    isDisabled: boolean;

    onChange: (value: boolean) => void;

    className?: string;
}) {
    return (
        <button
            className={`${styles.custom_checkbox_div} ${isDisabled ? styles.disabled : styles.enabled} ${
                className ? className : ""
            }`}
            onClick={() => {
                if (!isDisabled) {
                    onChange(!value);
                }
            }}
            type="button"
        >
            <div className={styles.checkbox_div}>
                <input
                    type="checkbox"
                    checked={value}
                    disabled={false}
                    onChange={() => {}}
                />
            </div>
            <div className={styles.text_div}>{text}</div>
        </button>
    );
}
