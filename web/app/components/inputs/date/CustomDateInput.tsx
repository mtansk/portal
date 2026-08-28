import { useState } from "react";
import styles from "./css/custom.module.scss";
import { UTCDateMini } from "@date-fns/utc";
import DateInputCalendarNew from "./DateInputCalendarNew";
import { formatUTCDate } from "@/app/functions/dates";
import { ModalPortal } from "../../form/ModalPortal";

export default function CustomDateInput({
    initialDate,
    isDisabled,

    onDateChange,
}: {
    initialDate: string | undefined;
    isDisabled: boolean;

    onDateChange: (date: string) => void;
}) {
    const [date, setDate] = useState(initialDate);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    function _onChange(date: string[] | Date) {
        if (Array.isArray(date)) {
            onDateChange(date[0]);
            setDate(date[0]);
        } else {
            onDateChange(formatUTCDate(date));
            setDate(formatUTCDate(date));
        }
        setDialogIsOpen(false);
    }

    return (
        <div
            className={
                styles.date_input_div +
                " " +
                (isDisabled ? styles.disabled : "") +
                " " +
                (dialogIsOpen ? styles.active : "")
            }
        >
            {dialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <CustomDateInputModal
                        initialDate={date}
                        onChange={_onChange}
                    />
                </ModalPortal>
            )}
            <div
                className={styles.main_div}
                onClick={() => {
                    if (!isDisabled) {
                        setDialogIsOpen(true);
                    }
                }}
            >
                <div className={styles.date}>
                    {date ?
                        Intl.DateTimeFormat("ru", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            timeZone: "UTC",
                        }).format(new UTCDateMini(date))
                    :   "дд.мм.гггг"}
                </div>
                {!isDisabled && <div className="icon">edit_calendar</div>}
            </div>
        </div>
    );
}

function CustomDateInputModal({
    initialDate,

    onChange,
}: {
    initialDate: string | undefined;

    onChange: (date: string[] | Date) => void;
}) {
    return (
        <div className={styles.modal_div}>
            <DateInputCalendarNew
                onChange={onChange}
                type="date"
                selectedDates={initialDate ? [initialDate] : []}
                isDisabled={false}
                shouldUseModal={false}
                maxSelectedDates={1}
            />
            <div className={styles.text}>Пожалуйста, выберите дату.</div>
        </div>
    );
}
