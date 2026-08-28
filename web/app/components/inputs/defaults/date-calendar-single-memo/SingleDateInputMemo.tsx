"use client";
import DateInputCalendarNew from "@/app/components/inputs/date/DateInputCalendarNew";
import DummyInput from "@/app/components/inputs/DummyInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { memo } from "react";

export const SingleDateInputMemo = memo(function SingleDateInput({
    isDisabled,
    selectedDate,
    onChange,

    reservedDates,
}: {
    isDisabled: boolean;
    selectedDate: string;
    onChange: (date: string[]) => void;

    reservedDates?: string[];
}) {
    return (
        <>
            <DummyInput value={selectedDate !== "" ? "1" : ""} />
            <InputWrapper
                headerLike={true}
                isDisabled={isDisabled}
                required={true}
                label="Дата"
            >
                <DateInputCalendarNew
                    type="date"
                    isDisabled={isDisabled}
                    onChange={onChange}
                    selectedDates={selectedDate ? [selectedDate] : []}
                    reservedDates={reservedDates || []}
                />
            </InputWrapper>
        </>
    );
});
