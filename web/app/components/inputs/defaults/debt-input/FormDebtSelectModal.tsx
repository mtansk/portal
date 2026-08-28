import { ModalPortal } from "@/app/components/form/ModalPortal";

import styles from "./select-modal.module.scss";
import { useState } from "react";
import { UTCDateMini } from "@date-fns/utc";
import { isSameMonth, startOfMonth } from "date-fns";
import { Formatter } from "@/app/classes/Formatter";
import { FormButtons } from "@/app/components/form/buttons/FormButtons";
import useSearchInput, { SearchInput } from "../../../searchbar/useSearchInput";
import { ApiDebt } from "@/app/types/finance/debts/Debts";

export default function FormDebtSelectModal({
    debts,
    selectedDebt,

    dialogIsOpen,
    setDialogIsOpen,

    onDebtSelection,
}: {
    debts: ApiDebt[];
    selectedDebt: string | null;

    dialogIsOpen: boolean;
    setDialogIsOpen: (isOpen: boolean) => void;

    onDebtSelection: (id: string | null) => void;
}) {
    const [selected, setSelected] = useState<string | null>(selectedDebt);
    /*     const [search, setSearch] = useState<string>(""); */

    const { search, setSearch, filteredArray } = useSearchInput(debts);

    if (!dialogIsOpen) {
        return null;
    }

    const debtSortedDates = Array.from(
        new Set(
            filteredArray.map((debt) =>
                startOfMonth(new UTCDateMini(debt.debt_date)).getTime(),
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
                <div className={styles.header}>Выберите задолженность</div>
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
                                styles.debt_button +
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
                                Не включено в задолженность.
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
                    {debtSortedDates.map((monthTimestamp) => {
                        const date = new Date(monthTimestamp);
                        const monthDebts = debts.filter((p) =>
                            isSameMonth(new UTCDateMini(p.debt_date), date),
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
                                    {monthDebts.map((debt) => {
                                        const isSelected =
                                            selected === debt.debt_id;

                                        return (
                                            <button
                                                key={debt.debt_id}
                                                className={
                                                    styles.debt_button +
                                                    " " +
                                                    (isSelected ?
                                                        styles.selected
                                                    :   "")
                                                }
                                                onClick={() => {
                                                    setSelected(debt.debt_id);
                                                }}
                                            >
                                                <div className={styles.name}>
                                                    {debt.debt_name}
                                                </div>
                                                <div className={styles.date}>
                                                    {Formatter.date(
                                                        new UTCDateMini(
                                                            debt.debt_date,
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
                                        onDebtSelection(selected);
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
