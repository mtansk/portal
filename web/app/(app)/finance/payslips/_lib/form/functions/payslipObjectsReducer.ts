import Payment from "@/app/classes/finance/Payment";
import { PayslipFO } from "@/app/classes/finance/PayslipFO";
import { SQLObject } from "@/app/classes/finance/Reduction";
import {
    AllFoNames,
    FOApiFields,
} from "@/app/types/finance/other/FinanceTypes";
import { Payslip } from "./utilityObject";

type actions = "ADD_OBJECT" | "REMOVE_OBJECT" | "SELECT_OBJECTS";

/* 
	payslip_id: string;
    payslip_date: string;
    payslip_name: string;
    payslip_st_date: string;
    payslip_en_date: string;
    user_id: string;

    selectedObjects: {
        accrual: string[];
        reduction: string[];
        payment: string[];
    }

    removedObjects: {
        accrual: string[];
        reduction: string[];
        payment: string[];

        taxDeduction: string[];
        socialFee: string[];
        tax: string[];
    }

    addedObjects: {
        taxDeduction: PayslipFO[];
        socialFee: PayslipFO[];
        tax: PayslipFO[];

        payment: SQLObject<Payment>[];
    }

*/

export type PayslipObjectsState = {
    payslip_id: string | null;
    selectedObjects: {
        accrual: string[];
        reduction: string[];
        payment: string[];
    };
    removedObjects: {
        accrual: string[];
        reduction: string[];
        payment: string[];

        taxDeduction: string[];
        socialFee: string[];
        tax: string[];
    };
    addedObjects: {
        taxDeduction: PayslipFO[];
        socialFee: PayslipFO[];
        tax: PayslipFO[];

        payment: SQLObject<Payment>[];
    };
};

export const payslipInitialState: PayslipObjectsState = {
    payslip_id: null,
    selectedObjects: {
        accrual: [],
        reduction: [],
        payment: [],
    },
    removedObjects: {
        accrual: [],
        reduction: [],
        payment: [],

        taxDeduction: [],
        socialFee: [],
        tax: [],
    },
    addedObjects: {
        taxDeduction: [],
        socialFee: [],
        tax: [],

        payment: [],
    },
};

export type PayslipObjectsDispatch = {
    type: actions;
    payload: {
        objectType: AllFoNames;
        id?: string;
        ids?: string[];
        object?: object;
    };
};

export function payslipObjectsReducer(
    state: PayslipObjectsState,
    action: PayslipObjectsDispatch,
) {
    const type = action.payload.objectType;
    function getNewState() {
        switch (action.type) {
            case "REMOVE_OBJECT":
                if (!("id" in action.payload)) return state;

                const id = action.payload.id;
                if (!id) return state;

                if (
                    Payslip.isAddableType(type) &&
                    Payslip.isAdded(state, id, type)
                ) {
                    return {
                        ...state,
                        addedObjects: {
                            ...state.addedObjects,
                            [type]: state.addedObjects[type].filter(
                                (obj) => obj.id !== id,
                            ),
                        },
                    };
                }

                if (
                    Payslip.isSelectableType(type) &&
                    Payslip.isSelected(state, id, type)
                ) {
                    return {
                        ...state,
                        selectedObjects: {
                            ...state.selectedObjects,
                            [type]: state.selectedObjects[type].filter(
                                (obj) => obj !== id,
                            ),
                        },
                    };
                }

                if (Payslip.isRemovableType(type)) {
                    return {
                        ...state,
                        removedObjects: {
                            ...state.removedObjects,
                            [type]: [...state.removedObjects[type], id],
                        },
                    };
                }
            case "ADD_OBJECT":
                if (!("object" in action.payload)) return state;
                return {
                    ...state,
                    addedObjects: {
                        ...state.addedObjects,
                        [action.payload.objectType]: [
                            ...state.addedObjects[
                                action.payload.objectType as
                                    | "taxDeduction"
                                    | "socialFee"
                                    | "tax"
                                    | "payment"
                            ],
                            action.payload.object,
                        ],
                    },
                };
            case "SELECT_OBJECTS":
                if (!("ids" in action.payload)) return state;

                const ids = action.payload.ids;

                if (Payslip.isSelectableType(type) && ids?.length) {
                    return {
                        ...state,
                        selectedObjects: {
                            ...state.selectedObjects,
                            [type]: [...state.selectedObjects[type], ...ids],
                        },
                    };
                }
            default:
                return state;
        }
    }

    const newState = getNewState();
    const _ = validateState();

    return _;
    function validateState() {
        const duplicates: string[] = [];

        newState.selectedObjects.accrual.forEach((id) => {
            if (newState.removedObjects.accrual.includes(id))
                duplicates.push(id);
        });

        newState.selectedObjects.reduction.forEach((id) => {
            if (newState.removedObjects.reduction.includes(id))
                duplicates.push(id);
        });

        newState.selectedObjects.payment.forEach((id) => {
            if (newState.removedObjects.payment.includes(id))
                duplicates.push(id);
        });

        return {
            ...newState,
            selectedObjects: {
                accrual: newState.selectedObjects.accrual.filter(
                    (id) => !duplicates.includes(id),
                ),
                reduction: newState.selectedObjects.reduction.filter(
                    (id) => !duplicates.includes(id),
                ),
                payment: newState.selectedObjects.payment.filter(
                    (id) => !duplicates.includes(id),
                ),
            },
            removedObjects: {
                ...newState.removedObjects,
                accrual: newState.removedObjects.accrual.filter(
                    (id) => !duplicates.includes(id),
                ),
                reduction: newState.removedObjects.reduction.filter(
                    (id) => !duplicates.includes(id),
                ),
                payment: newState.removedObjects.payment.filter(
                    (id) => !duplicates.includes(id),
                ),
            },
        };
    }
}
