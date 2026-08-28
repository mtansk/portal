"use client";

import { Formatter } from "@/app/classes/Formatter";
import { UTCDateMini } from "@date-fns/utc";

import styles from "./css/accruals.module.scss";

import { ApiSheet } from "@/app/types/sheet/Sheets";
import { ApiAccrual } from "@/app/types/finance/accrual/Accruals";
import { ApiReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiPayment } from "@/app/types/finance/payments/Payments";
import { getFinanceObjectType } from "@/app/(app)/finance/_lib/functions";
import { PayslipObjectsDispatch } from "../functions/payslipObjectsReducer";
import { PayslipShownObjects } from "../functions/other";
import { PayslipListItemRow, PayslipContainer } from "./PayslipItemRows";
import { AllFoNames, EFONames } from "@/app/types/finance/other/FinanceTypes";

export function foNameString(type: AllFoNames) {
    switch (type) {
        case "accrual":
            return "Начисления";
        case "reduction":
            return "Удержания";
        case "payment":
            return "Выплаты";
    }
}

export function PayslipObjectsContainer({
    objects,
    type,

    isDisabled,
    dispatch,
    onAddPaymentClick,
    onSelectClick,
}: {
    objects: PayslipShownObjects<
        (ApiSheet | ApiAccrual) | ApiReduction | ApiPayment
    >;
    type: EFONames;

    isDisabled: boolean;
    dispatch: (o: PayslipObjectsDispatch) => void;
    onAddPaymentClick?: () => void;
    onSelectClick: (type: EFONames) => void;
}) {
    const conatinerTitle = () => {
        switch (type) {
            case "accrual":
                return "Начисления";
            case "payment":
                return "Выплаты";
            case "reduction":
                return "Удержания";
        }
    };

    const sortedDates = objects.array
        .map((obj) => {
            return obj.date;
        })
        .sort(
            (a, b) =>
                new UTCDateMini(a).getTime() - new UTCDateMini(b).getTime(),
        );

    const dates = new Set(sortedDates);

    const objectsTotal = objects.total * (type === "reduction" ? -1 : 1);

    const Inner = () => {
        return (
            <div className={styles.accruals_body}>
                <div className={styles.body_div}>
                    <div className={styles.list}>
                        {Array.from(dates).map((date) => {
                            return (
                                <div
                                    className={styles.date_block}
                                    key={`accruals-date-block-${date}`}
                                >
                                    <div className={styles.header}>
                                        {Intl.DateTimeFormat("ru", {
                                            day: "numeric",
                                            weekday: "short",
                                            month: "short",
                                        }).format(new UTCDateMini(date))}
                                    </div>
                                    <div className={styles.body}>
                                        {objects.array
                                            .filter((obj) => {
                                                return obj.date === date;
                                            })
                                            .map((obj) => {
                                                return (
                                                    <PayslipListItemRow
                                                        obj={obj}
                                                        key={`accruals-object-${obj.id}`}
                                                        isDisabled={isDisabled}
                                                        onCrossClick={(id) => {
                                                            dispatch({
                                                                type: "REMOVE_OBJECT",
                                                                payload: {
                                                                    id,
                                                                    objectType:
                                                                        getFinanceObjectType(
                                                                            obj,
                                                                            true,
                                                                        ) ||
                                                                        "accrual",
                                                                },
                                                            });
                                                        }}
                                                    />
                                                );
                                            })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.bottom_div}>
                    <div className={styles.select}>
                        {!isDisabled && (
                            <>
                                <button
                                    className={styles.select_button}
                                    onClick={() => onSelectClick(type)}
                                    type="button"
                                >
                                    Выбрать
                                </button>
                                {type === "payment" && (
                                    <>
                                        <div className={styles.stripe}>
                                            <div></div>
                                        </div>
                                        <button
                                            className={styles.select_button}
                                            onClick={onAddPaymentClick}
                                            type="button"
                                        >
                                            Добавить
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className={styles.total}>
                        {`${Formatter.currencyString({
                            value: objectsTotal,
                            signDisplay: "negative",
                        })}`}
                    </div>
                </div>
            </div>
        );
    };

    if (type === "payment") {
        return (
            <div className={styles.payments_main}>
                <div className={styles.payments_header}>Выплаты</div>
                <Inner />
            </div>
        );
    }

    return (
        <PayslipContainer title={conatinerTitle() || ""}>
            <Inner />
        </PayslipContainer>
    );
}
