import {
    FOApiFields,
    EFOApiFields,
    AllFoNames,
} from "@/app/types/finance/other/FinanceTypes";
import { PayslipObjectsState } from "./payslipObjectsReducer";
import { isShown, Payslip } from "./utilityObject";
import { calculateFOArrayTotal } from "@/app/(app)/finance/_lib/functions";
import { UTCDateMini } from "@date-fns/utc";

export type PayslipShownObjects<T> = {
    array: T[];
    total: number;
};

/* export function constructObject<T extends FOApiFields[] | EFOApiFields[]>( */
export function constructObject<T extends { [key: string]: any } & FOApiFields>(
    array: T[],
    type: AllFoNames,
    state: PayslipObjectsState,
    payslip_id?: string,
): {
    array: T[];
    total: number;
} {
    const shownArray = filterShownObjects();

    return {
        array: shownArray as T[],
        total: calculateFOArrayTotal(shownArray),
    };

    function filterShownObjects() {
        const _filteredArray = array.filter((o) => {
            return isShown(state, o, type, payslip_id);
        });

        if (Payslip.isAddableType(type)) {
            const _arrayWithAdded = [
                ..._filteredArray,
                ...state.addedObjects[type],
            ];
            return _arrayWithAdded;
        }

        return _filteredArray;
    }
}

export function getDatesSet(
    objects: ({ [key: string]: any } & EFOApiFields)[],
) {
    const sortedDates = objects
        .map((obj) => {
            return obj.date;
        })
        .sort(
            (a, b) =>
                new UTCDateMini(a).getTime() - new UTCDateMini(b).getTime(),
        );

    return new Set(sortedDates);
}
