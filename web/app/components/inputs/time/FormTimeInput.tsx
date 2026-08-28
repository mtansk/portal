import { useEffect, useState } from "react";

import DummyInput from "../DummyInput";
import styles from "./time-input.module.scss";

export default function FormTimeInput<T>({
    value,
    name,
    disabled,
    tabIndex,
    required,

    handleTimeInputChange,

    id,
}: {
    value: string;
    name: keyof T;
    disabled: boolean;
    tabIndex?: number;
    required?: boolean;
    handleTimeInputChange: (name: keyof T, value: number | null) => void;

    id?: string;
}) {
    const [time, setTime] = useState<string>(value);

    useEffect(() => {
        setTime(value);
    }, [value]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const input = e.target;
        const value = input.value.replace(/\D/g, "");
        if (value === "") {
            setTime("");
            handleTimeInputChange(name, null);
            return;
        }

        const hours = value.slice(0, 2);
        const minutes = value.slice(2, 4) ? value.slice(2, 4) : "";
        const extra = value.slice(4) ? value.slice(4) : "";

        if (value.length < 5) {
            if (value.length > 2) {
                setTime(`${hours}:${minutes}`);
            } else {
                setTime((prevTime) => `${hours}`);
            }
        } else {
            setTime((prevTime) => `${extra}`);
        }

        if (input.checkValidity()) {
            const time1 = parseInt(hours) * 3600 + parseInt(minutes) * 60;
            handleTimeInputChange(name, time1);
        }
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
        e.target.setSelectionRange(0, e.target.value.length);
    }

    return (
        <>
            <input
                type="text"
                value={time}
                className={styles.time}
                disabled={disabled}
                name={String(name)}
                onChange={(e) => handleInputChange(e)}
                onFocus={(e) => handleFocus(e)}
                autoComplete="off"
                pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                tabIndex={tabIndex}
                placeholder="--:--"
                id={id || String(name)}
                inputMode="numeric"
                required={required}
            />
            {required && <DummyInput value={value} />}
        </>
    );
}
