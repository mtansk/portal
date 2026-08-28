import { ApiAccrual, ApiMyAccrual } from "../finance/accrual/Accruals";
import { ApiMyPayment, ApiPayment } from "../finance/payments/Payments";
import { ApiMyReduction, ApiReduction } from "../finance/reductions/Reductions";
import { ApiTax } from "../finance/taxes/Taxes";
import { ApiMySheet, ApiSheet } from "../sheet/Sheets";

export function isSheet(object: any): object is ApiSheet {
    return "sheet_id" in object;
}
export function isAccrual(object: any): object is ApiAccrual {
    return "accrual_id" in object;
}

export function isPayment(object: any): object is ApiPayment {
    return "payment_id" in object;
}

export function isReduction(object: any): object is ApiReduction {
    return "reduction_id" in object;
}

export function isTax(object: any): object is ApiTax {
    return "tax_id" in object;
}

export function isTaxDeduction(object: any): object is ApiTax {
    return "tax_deduction_id" in object;
}

export function isSocialFee(object: any): object is ApiTax {
    return "social_fee_id" in object;
}

export function isMyApiAccrual(object: unknown): object is ApiMyAccrual {
    return object?.hasOwnProperty("accrual_id") || false;
}

export function isMyApiSheet(object: unknown): object is ApiMySheet {
    return object?.hasOwnProperty("sheet_id") || false;
}

export function isMyApiReduction(object: unknown): object is ApiMyReduction {
    return object?.hasOwnProperty("reduction_id") || false;
}

export function isMyApiPayment(object: unknown): object is ApiMyPayment {
    return object?.hasOwnProperty("payment_id") || false;
}
