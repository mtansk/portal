import { ApiAccrual } from "@/app/types/finance/accrual/Accruals";
import { ApiPayment } from "@/app/types/finance/payments/Payments";
import { ApiReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiSocialFee } from "@/app/types/finance/social-fees/SocialFees";
import { ApiTaxDeduction } from "@/app/types/finance/tax-deductions/TaxDeduction";
import { ApiTax } from "@/app/types/finance/taxes/Taxes";
import { ApiSheet } from "@/app/types/sheet/Sheets";
import { constructObject } from "./other";
import { PayslipObjectsState } from "./payslipObjectsReducer";
import {
    AllFoNames,
    FOApiFields,
} from "@/app/types/finance/other/FinanceTypes";

export default function getPayslipObjects({
    accruals,
    reductions,
    payments,
    taxes,
    taxDeductions,
    socialFees,

    payslipObjects,
    payslip_id,
}: {
    accruals: (ApiAccrual | ApiSheet)[];
    reductions: ApiReduction[];
    payments: ApiPayment[];
    taxes: ApiTax[];
    taxDeductions: ApiTaxDeduction[];
    socialFees: ApiSocialFee[];

    payslipObjects: PayslipObjectsState;
    payslip_id?: string;
}) {
    function _construct<T extends { [key: string]: any } & FOApiFields>(
        array: T[],
        type: AllFoNames,
    ) {
        return constructObject(array, type, payslipObjects, payslip_id);
    }

    const accrualsObjects = _construct(accruals, "accrual");
    const reductionsObjects = _construct(reductions, "reduction");
    const paymentsObjects = _construct(payments, "payment");
    const taxesObjects = _construct(taxes, "tax");
    const taxDeductionsObjects = _construct(taxDeductions, "taxDeduction");
    const socialFeesObjects = _construct(socialFees, "socialFee");

    return {
        accrualsObjects,
        reductionsObjects,
        paymentsObjects,
        taxesObjects,
        taxDeductionsObjects,
        socialFeesObjects,
    };
}
