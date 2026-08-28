import InputWrapper from "../../wrapper/InputWrapper";
import styles from "./percent.module.scss";

export function PercentInput({
    value,
    onChange,

    isDisabled,
}: {
    value: number | string | null | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    isDisabled: boolean;
}) {
    function _value() {
        if (value === undefined || value === null || value === "") {
            return "";
        }
        const parsed = value;
        return parsed;
    }

    return (
        <InputWrapper
            isDisabled={isDisabled}
            required={true}
            label="Ставка, (n% / 100)"
            id="default-percent-input"
        >
            <input
                type="number"
                value={_value()}
                disabled={isDisabled}
                name="rate"
                onChange={(e) => {
                    if (e.target.value.length > 7) {
                        return;
                    }
                    onChange(e);
                }}
                placeholder="0,13"
                required={true}
                id="default-percent-input"
                className={styles.percent}
                step={0.0001}
                min={0}
                max={100}
                inputMode="decimal"
            />
        </InputWrapper>
    );
}
