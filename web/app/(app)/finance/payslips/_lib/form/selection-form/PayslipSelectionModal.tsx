import { EFONames } from "@/app/types/finance/other/FinanceTypes";
import styles from "./s-form.module.scss";
import { ApiAccrual } from "@/app/types/finance/accrual/Accruals";
import { ApiReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiPayment } from "@/app/types/finance/payments/Payments";
import { foNameString } from "../form-body/PayslipObjectsContainer";
import { FormButtons } from "@/app/components/form/buttons/FormButtons";
import { getFinanceObjectType } from "@/app/(app)/finance/_lib/functions";
import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import { FODetails } from "@/app/(app)/finance/_lib/other/FODetails";
import foGroupString from "@/app/(app)/finance/_lib/other/FoGroupString";
import { parseFloatAny } from "@/app/functions/other";
import { useState } from "react";
import { PayslipObjectsDispatch } from "../functions/payslipObjectsReducer";
import { ApiSheet } from "@/app/types/sheet/Sheets";
import { UTCDateMini } from "@date-fns/utc";
import { getDatesSet } from "../functions/other";

export default function PayslipSelectionModal({
    objects,

    setDialogIsOpen,

    typeOfObject,
    dispatch,
}: {
    objects: (ApiAccrual | ApiSheet)[] | ApiReduction[] | ApiPayment[];

    setDialogIsOpen: (isOpen: boolean) => void;

    typeOfObject: EFONames;
    dispatch: (o: PayslipObjectsDispatch) => void;
}) {
    const [selectedObjects, setSelectedObjects] = useState<string[]>([]);

    function handleSaveSelection() {
        dispatch({
            type: "SELECT_OBJECTS",
            payload: {
                objectType: typeOfObject,
                id: "a",
                ids: selectedObjects,
            },
        });
        setDialogIsOpen(false);
    }

    function handleObjectSelect(id: string) {
        if (selectedObjects.includes(id)) {
            setSelectedObjects((prev) => prev.filter((o) => o !== id));
        } else {
            setSelectedObjects((prev) => [...prev, id]);
        }
    }

    const dates = getDatesSet(objects);

    return (
        <div className={styles.main_div}>
            <div className={styles.header}>{foNameString(typeOfObject)}</div>
            <div className={styles.body}>
                {Array.from(dates).map((date) => {
                    return (
                        <div
                            className={styles.date_block}
                            key={`selection-date-block-${date}`}
                        >
                            <div className={styles.block_header}>
                                {Intl.DateTimeFormat("ru", {
                                    day: "numeric",
                                    weekday: "short",
                                    month: "short",
                                }).format(new UTCDateMini(date))}
                            </div>
                            <div className={styles.block_body}>
                                {objects
                                    .filter((obj) => {
                                        return obj.date === date;
                                    })
                                    .map((object) => {
                                        const isSelected =
                                            selectedObjects.includes(object.id);
                                        return (
                                            <div
                                                className={
                                                    styles.list_item_row +
                                                    " " +
                                                    (isSelected ?
                                                        styles.selected
                                                    :   "")
                                                }
                                                key={object.id}
                                                onClick={() =>
                                                    handleObjectSelect(
                                                        object.id,
                                                    )
                                                }
                                            >
                                                <div className={styles.group}>
                                                    {foGroupString(object)}
                                                </div>
                                                <div className={styles.name}>
                                                    {object.name}
                                                </div>
                                                <div className={styles.details}>
                                                    <FODetails
                                                        object={object}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        styles.total +
                                                        " " +
                                                        styles[
                                                            getFinanceObjectType(
                                                                object,
                                                            ) || ""
                                                        ]
                                                    }
                                                >
                                                    {
                                                        <FinanceCurrencyStringNew
                                                            total={parseFloatAny(
                                                                object.total ||
                                                                    0,
                                                            )}
                                                            type={getFinanceObjectType(
                                                                object,
                                                            )}
                                                        />
                                                    }
                                                </div>

                                                <div className={styles.rem}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            handleObjectSelect(
                                                                object.id,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    );
                })}

                {objects.length === 0 && (
                    <div>
                        Объектов для выбора нет. Но вы можете добавить их на
                        соответствующей вкладке в разделе Зарплата.
                    </div>
                )}
            </div>
            <FormButtons
                notation={{
                    right: [
                        {
                            style: "ne",
                            text: "Отмена",
                            onClick: () => setDialogIsOpen(false),
                        },
                        {
                            style: "g",
                            text: "Сохранить",
                            onClick: handleSaveSelection,
                            disabled: selectedObjects.length === 0,
                        },
                    ],
                }}
            />
        </div>
    );
}
