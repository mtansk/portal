import {
    AllFinanceObjects,
    AllFoNames,
    FOApiFields,
} from "@/app/types/finance/other/FinanceTypes";
import { PayslipObjectsState } from "./payslipObjectsReducer";

export const Payslip = {
    isSelected,
    isAdded,
    isRemoved,
    isInitial,
    isShown,
    isInSelectionList,

    isSelectableType: isPayslipSelectable,
    isAddableType: isPayslipAddable,
    isRemovableType: isPayslipRemovable,
};

/* 


*/
const allowedPayslipObjects = {
    selectable: ["accrual", "reduction", "payment"],
    addable: ["taxDeduction", "socialFee", "tax", "payment"],
    removable: [
        "accrual",
        "reduction",
        "payment",
        "taxDeduction",
        "socialFee",
        "tax",
    ],
};

function isPayslipSelectable(
    type: string | undefined,
): type is PayslipSelectable {
    if (!type) return false;
    return allowedPayslipObjects.selectable.includes(type);
}

function isPayslipAddable(type: string | undefined): type is PayslipAddable {
    if (!type) return false;
    return allowedPayslipObjects.addable.includes(type);
}

function isPayslipRemovable(
    type: string | undefined,
): type is PayslipRemovable {
    if (!type) return false;
    return allowedPayslipObjects.removable.includes(type);
}

type PayslipSelectable = "accrual" | "reduction" | "payment";
type PayslipAddable = "taxDeduction" | "socialFee" | "tax" | "payment";
type PayslipRemovable =
    | "accrual"
    | "reduction"
    | "payment"
    | "taxDeduction"
    | "socialFee"
    | "tax";

type utilityObject = object & FOApiFields;

function isSelected(
    payslipState: PayslipObjectsState,
    id: string,
    type: AllFoNames,
) {
    if (Payslip.isSelectableType(type)) {
        return payslipState.selectedObjects[type].includes(id);
    } else {
        return false;
    }
}

function isAdded(
    payslipState: PayslipObjectsState,
    id: string,
    type: AllFoNames,
) {
    if (Payslip.isAddableType(type)) {
        return (
            payslipState.addedObjects[type].findIndex(
                (obj) => obj.id === id,
            ) !== -1
        );
    } else {
        return false;
    }
}

function isRemoved(
    payslipState: PayslipObjectsState,
    id: string,
    type: AllFoNames,
) {
    if (Payslip.isRemovableType(type)) {
        return payslipState.removedObjects[type].includes(id);
    } else {
        return false;
    }
}

export function isInitial(payslip_id: string | null, object: utilityObject) {
    return object.payslip_id && object.payslip_id === payslip_id ? true : false;
}

export function isShown(
    payslipState: PayslipObjectsState,
    object: utilityObject,
    type: AllFoNames,
    payslip_id?: string | null,
) {
    if (isRemoved(payslipState, object.id, type)) return false;

    if (payslip_id && isInitial(payslip_id, object)) return true;
    if (isSelected(payslipState, object.id, type)) return true;
    if (isAdded(payslipState, object.id, type)) return true;

    return false;
}

export function isInSelectionList(
    payslipState: PayslipObjectsState,
    object: utilityObject,
    type: AllFoNames,
) {
    if (isRemoved(payslipState, object.id, type)) return true;
    if (!object.payslip_id && !isSelected(payslipState, object.id, type))
        return true;

    return false;
}
