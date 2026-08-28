import InputWrapper from "../../wrapper/InputWrapper";
import styles from "./qty.module.scss";

export function QtyInput({
    value,
    onChange,

    label,
    isDisabled,
    name,
}: {
    value: number | string | null | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    label?: string;
    isDisabled: boolean;
    name?: string;
}) {
    function _value() {
        if (value === undefined || value === null) {
            return "";
        }
        const parsed = value;
        return parsed;
    }

    return (
        <InputWrapper
            isDisabled={isDisabled}
            required={true}
            label={label || "Количество"}
            id="default-qty-input"
        >
            <input
                type="number"
                value={_value()}
                disabled={isDisabled}
                name={name || "qty"}
                onChange={(e) => {
                    if (e.target.value.length > 14) {
                        return;
                    }
                    onChange(e);
                }}
                placeholder="0,00"
                required={true}
                id="default-qty-input"
                className={styles.qty}
                step={0.0001}
                min={0}
                max={100_000_000}
                inputMode="decimal"
            />
        </InputWrapper>
    );
}
