import { ApiMyAccrual } from "@/app/types/finance/accrual/Accruals";
import { ApiMyPayment } from "@/app/types/finance/payments/Payments";
import { ApiMyReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiMySocialFee } from "@/app/types/finance/social-fees/SocialFees";
import { ApiMyTaxDeduction } from "@/app/types/finance/tax-deductions/TaxDeduction";
import { ApiMyTax } from "@/app/types/finance/taxes/Taxes";
import { ApiMySheet } from "@/app/types/sheet/Sheets";
import styles from "./css/form.module.scss";
import {
    MyPayslipObjectGroup,
    MyPayslipTaxesGroup,
} from "./MyPayslipObjectGroup";
import { memo } from "react";

const MyPayslipMemoBody = memo(function MyPayslipMemoBody({
    accruals,
    reductions,
    payments,
    taxes,
    taxDeductions,
    socialFees,
    handleObjectClick,
}: {
    accruals: (ApiMyAccrual | ApiMySheet)[];
    reductions: ApiMyReduction[];
    payments: ApiMyPayment[];
    taxes: ApiMyTax[];
    taxDeductions: ApiMyTaxDeduction[];
    socialFees: ApiMySocialFee[];
    handleObjectClick?: (id: string) => void;
}) {
    return (
        <>
            <div className={styles.accruals}>
                <MyPayslipObjectGroup
                    arrayOfObjects={accruals}
                    typeOfObject="accrual"
                    handleObjectClick={handleObjectClick}
                />
            </div>
            <div className={styles.reductions}>
                <MyPayslipObjectGroup
                    arrayOfObjects={reductions}
                    typeOfObject="reduction"
                    handleObjectClick={handleObjectClick}
                />
            </div>
            <div className={styles.payments}>
                <MyPayslipObjectGroup
                    arrayOfObjects={payments}
                    typeOfObject="payment"
                    handleObjectClick={handleObjectClick}
                />
            </div>
            <div className={styles.taxes}>
                <MyPayslipTaxesGroup
                    socialFees={socialFees}
                    taxDeductions={taxDeductions}
                    taxes={taxes}
                />
            </div>
        </>
    );
});

export default MyPayslipMemoBody;
