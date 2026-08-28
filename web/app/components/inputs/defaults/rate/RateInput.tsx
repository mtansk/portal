import InputWrapper from "../../wrapper/InputWrapper";
import styles from "./rate.module.scss";

export function RateInput({
    value,
    onChange,

    isDisabled,
    required,

    label,
    name,
    max,
    id,
    step,
}: {
    value: number | string | null | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    isDisabled: boolean;
    required?: boolean;

    label?: string;
    name?: string;
    max?: number;
    id?: string;
    step?: number;
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
            required={required !== undefined ? required : true}
            label={label ?? "Ставка, руб."}
            id={id || "default-rate-input"}
        >
            <input
                type="number"
                value={_value()}
                disabled={isDisabled}
                name={name || "rate"}
                onChange={(e) => {
                    if (e.target.value.length > 12) {
                        return;
                    }
                    onChange(e);
                }}
                placeholder="0,00"
                required={required !== undefined ? required : true}
                id={id || "default-rate-input"}
                className={styles.rate}
                step={step || 0.0001}
                min={0}
                max={max || 1_000_000}
                maxLength={11}
                inputMode="decimal"
            />
        </InputWrapper>
    );
}
