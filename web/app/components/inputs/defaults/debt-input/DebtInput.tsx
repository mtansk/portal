"use client";

import { Formatter } from "@/app/classes/Formatter";
import useBackURL from "@/app/components/hooks/useBackURL";

import { UTCDateMini } from "@date-fns/utc";
import { useState } from "react";
import FormDebtSelectModal from "./FormDebtSelectModal";
import styles from "./debt-input.module.scss";
import AwayLink from "@/app/components/link/AwayLink";
import { ApiDebt } from "@/app/types/finance/debts/Debts";

export function DebtInput({
    debts,
    selectedDebt,

    onDebtSelecteion,

    isDisabled,
}: {
    debts?: ApiDebt[];

    selectedDebt: string | null;
    onDebtSelecteion: (value: string | null) => void;

    isDisabled: boolean;
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const debt = debts?.find((p) => p.debt_id === selectedDebt);

    return (
        <>
            {dialogIsOpen && (
                <FormDebtSelectModal
                    debts={debts || []}
                    selectedDebt={selectedDebt}
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                    onDebtSelection={onDebtSelecteion}
                />
            )}
            <div className={styles.debt_input}>
                <div className={styles.debt_main}>
                    {debt ?
                        <div className={styles.debt_div}>
                            <div className={styles.name}>{debt.debt_name}</div>
                            <div className={styles.date}>
                                {Formatter.date(
                                    new UTCDateMini(debt.debt_date),
                                    "shortRu",
                                )}
                            </div>
                        </div>
                    :   "Не включено в задолженность."}
                </div>

                <div className={styles.debt_bottom}>
                    {!isDisabled && (
                        <button
                            className={styles.debt_button}
                            onClick={() => setDialogIsOpen(true)}
                            type="button"
                            disabled={isDisabled}
                        >
                            Изменить
                        </button>
                    )}
                    {debt?.debt_id && <DebtLink id={debt?.debt_id || ""} />}
                </div>
            </div>
        </>
    );
}

function DebtLink({ id }: { id: string }) {
    const backurl = useBackURL();
    const href = `/finance/debts/${id}?backurl=${backurl}`;

    return (
        <AwayLink
            href={href}
            title="Перейти к долгу"
        />
    );
}
