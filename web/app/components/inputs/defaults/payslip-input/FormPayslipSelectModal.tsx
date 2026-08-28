import { ModalPortal } from "@/app/components/form/ModalPortal";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";

import styles from "./select-modal.module.scss";
import { useState } from "react";
import { UTCDateMini } from "@date-fns/utc";
import { isSameMonth, startOfMonth } from "date-fns";
import { Formatter } from "@/app/classes/Formatter";
import { FormButtons } from "@/app/components/form/buttons/FormButtons";
import useSearchInput, { SearchInput } from "../../../searchbar/useSearchInput";

export default function FormPayslipSelectModal({
    payslips,
    selectedPayslip,

    dialogIsOpen,
    setDialogIsOpen,

    onPayslipSelection,
}: {
    payslips: ApiPayslip[];
    selectedPayslip: string | null;

    dialogIsOpen: boolean;
    setDialogIsOpen: (isOpen: boolean) => void;

    onPayslipSelection: (id: string | null) => void;
}) {
    const [selected, setSelected] = useState<string | null>(selectedPayslip);
    const { search, setSearch, filteredArray } = useSearchInput(payslips);

    if (!dialogIsOpen) {
        return null;
    }

    const payslipSortedDates = Array.from(
        new Set(
            filteredArray.map((payslip) =>
                startOfMonth(new UTCDateMini(payslip.payslip_date)).getTime(),
            ),
        ),
    ).sort(
        (b, a) => new UTCDateMini(a).getTime() - new UTCDateMini(b).getTime(),
    );

    return (
        <ModalPortal
            dialogIsOpen={dialogIsOpen}
            setDialogIsOpen={setDialogIsOpen}
        >
            <div className={styles.main_div}>
                <div className={styles.header}>Выберите расчетный лист</div>
                <div className={styles.body}>
                    <div className={styles.search}>
                        <SearchInput
                            search={search}
                            setSearch={setSearch}
                        />
                    </div>
                    <div className={styles.month_body}>
                        <button
                            className={
                                styles.payslip_button +
                                " " +
                                styles.empty +
                                " " +
                                (selected === null ? styles.selected : "")
                            }
                            onClick={() => {
                                setSelected(null);
                            }}
                        >
                            <div className={styles.name}>
                                Не включено в расчетный лист.
                            </div>
                            <div className={styles.radio}>
                                <input
                                    type="radio"
                                    checked={selected === null}
                                    onChange={() => {}}
                                />
                            </div>
                        </button>
                    </div>
                    {payslipSortedDates.map((monthTimestamp) => {
                        const date = new Date(monthTimestamp);
                        const monthPayslips = payslips.filter((p) =>
                            isSameMonth(new UTCDateMini(p.payslip_date), date),
                        );
                        return (
                            <div
                                className={styles.month_div}
                                key={monthTimestamp}
                            >
                                <div className={styles.month_header}>
                                    {Intl.DateTimeFormat("ru", {
                                        month: "long",
                                        year: "numeric",
                                    }).format(date)}
                                </div>
                                <div className={styles.month_body}>
                                    {monthPayslips.map((payslip) => {
                                        const isSelected =
                                            selected === payslip.payslip_id;

                                        return (
                                            <button
                                                key={payslip.payslip_id}
                                                className={
                                                    styles.payslip_button +
                                                    " " +
                                                    (isSelected ?
                                                        styles.selected
                                                    :   "")
                                                }
                                                onClick={() => {
                                                    setSelected(
                                                        payslip.payslip_id,
                                                    );
                                                }}
                                            >
                                                <div className={styles.name}>
                                                    {payslip.payslip_name}
                                                </div>
                                                <div className={styles.period}>
                                                    {`${Formatter.date(
                                                        new UTCDateMini(
                                                            payslip.payslip_st_date,
                                                        ),
                                                        "shortRu",
                                                    )} - ${Formatter.date(
                                                        new UTCDateMini(
                                                            payslip.payslip_en_date,
                                                        ),
                                                        "shortRu",
                                                    )}`}
                                                </div>
                                                <div className={styles.date}>
                                                    {Formatter.date(
                                                        new UTCDateMini(
                                                            payslip.payslip_date,
                                                        ),
                                                        "shortRu",
                                                    )}
                                                </div>
                                                <div className={styles.radio}>
                                                    <input
                                                        type="radio"
                                                        checked={isSelected}
                                                        onChange={() => {}}
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.buttons}>
                    <FormButtons
                        notation={{
                            right: [
                                {
                                    style: "ne",
                                    text: "Выйти",
                                    onClick() {
                                        setDialogIsOpen(false);
                                    },
                                },
                                {
                                    style: "g",
                                    text: "Сохранить",
                                    onClick() {
                                        onPayslipSelection(selected);
                                        setDialogIsOpen(false);
                                    },
                                },
                            ],
                        }}
                    />
                </div>
            </div>
        </ModalPortal>
    );
}
