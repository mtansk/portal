import styles from "./radio.module.scss";

export default function CustomRadio<T>({
    array,
    currentSelection,
    title,

    isDisabled,

    getOptionText,

    handleSelection,
}: {
    array: T[];
    currentSelection: T;
    title: string;

    isDisabled: boolean;

    getOptionText: (option: T) => string;

    handleSelection: (selection: T) => void;
}) {
    return (
        <div className={styles.custom_radio_div}>
            <div className={styles.title}>{title}</div>
            <div className={styles.options_div}>
                {array.map((option, index) => {
                    return (
                        <div
                            key={index}
                            className={`${styles.option} ${currentSelection === option ? styles.selected : ""} ${isDisabled ? styles.disabled : styles.enabled}`}
                            onClick={() =>
                                !isDisabled && handleSelection(option)
                            }
                        >
                            <input
                                type="radio"
                                checked={currentSelection === option}
                                onChange={() => {}}
                                disabled={isDisabled}
                            />
                            {getOptionText(option)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
