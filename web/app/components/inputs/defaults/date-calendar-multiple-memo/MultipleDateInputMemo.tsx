"use client";

import DateInputCalendarNew from "@/app/components/inputs/date/DateInputCalendarNew";
import DummyInput from "@/app/components/inputs/DummyInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { memo } from "react";

export const MultipleDateInputMemo = memo(function MultipleDateInput({
    isDisabled,
    selectedDates,
    onChange,

    reservedDates,
}: {
    isDisabled: boolean;
    selectedDates: string[];
    onChange: (dates: string[]) => void;

    reservedDates?: string[];
}) {
    return (
        <InputWrapper
            headerLike={true}
            isDisabled={isDisabled}
            required={true}
            label="Даты"
        >
            <DummyInput value={selectedDates.length > 0 ? "1" : ""} />
            <DateInputCalendarNew
                type="dates"
                isDisabled={isDisabled}
                onChange={onChange}
                selectedDates={selectedDates}
                reservedDates={reservedDates || []}
            />
        </InputWrapper>
    );
});
