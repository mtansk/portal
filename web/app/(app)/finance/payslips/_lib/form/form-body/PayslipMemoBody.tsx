import { memo } from "react";
import styles from "./css/form.module.scss";
import { PayslipObjectsContainer } from "./PayslipObjectsContainer";
import PayslipTaxesContainer from "./PayslipTaxesContainer";
import {
    EFOApiFields,
    EFONames,
    FOApiFields,
    FONames,
} from "@/app/types/finance/other/FinanceTypes";
import { ApiAccrual } from "@/app/types/finance/accrual/Accruals";
import { ApiSheet } from "@/app/types/sheet/Sheets";
import { ApiReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiPayment } from "@/app/types/finance/payments/Payments";
import { PayslipShownObjects } from "../functions/other";
import { PayslipObjectsDispatch } from "../functions/payslipObjectsReducer";

export const PayslipMemoBody = memo(function PayslipMemoBody({
    accrualsClass,
    reductionsClass,
    paymentsClass,
    socialFees,
    taxDeductions,
    taxes,
    isDisabled,

    dispatch,
    onAddFOClick,
    onAddPaymentClick,
    onSelectClick,
}: {
    accrualsClass: PayslipShownObjects<ApiAccrual | ApiSheet>;
    reductionsClass: PayslipShownObjects<ApiReduction>;
    paymentsClass: PayslipShownObjects<ApiPayment>;

    taxes: PayslipShownObjects<FOApiFields>;
    taxDeductions: PayslipShownObjects<FOApiFields>;
    socialFees: PayslipShownObjects<FOApiFields>;

    isDisabled: boolean;

    dispatch: (o: PayslipObjectsDispatch) => void;

    onAddFOClick: (type: FONames) => void;
    onAddPaymentClick: () => void;
    onSelectClick: (type: EFONames) => void;
}) {
    return (
        <>
            <div className={styles.accruals}>
                <PayslipObjectsContainer
                    objects={accrualsClass}
                    isDisabled={isDisabled}
                    type="accrual"
                    dispatch={dispatch}
                    onSelectClick={onSelectClick}
                />
            </div>
            <div className={styles.reductions}>
                <PayslipObjectsContainer
                    objects={reductionsClass}
                    isDisabled={isDisabled}
                    type="reduction"
                    dispatch={dispatch}
                    onSelectClick={onSelectClick}
                />
            </div>
            <div className={styles.taxes}>
                <PayslipTaxesContainer
                    socialFees={socialFees}
                    taxDeductions={taxDeductions}
                    taxes={taxes}
                    isDisabled={isDisabled}
                    dispatch={dispatch}
                    onAddFOClick={onAddFOClick}
                />
            </div>
            <div className={styles.payments}>
                <PayslipObjectsContainer
                    objects={paymentsClass}
                    isDisabled={isDisabled}
                    type="payment"
                    dispatch={dispatch}
                    onAddPaymentClick={onAddPaymentClick}
                    onSelectClick={onSelectClick}
                />
            </div>
        </>
    );
});
