import {
    isAccrual,
    isPayment,
    isReduction,
    isSheet,
    isSocialFee,
    isTax,
    isTaxDeduction,
} from "@/app/types/guards/guards";

export default function foGroupString(obj: any) {
    if (isAccrual(obj)) {
        if (obj.accrual_group_id === null || obj.accrual_group_id === "0") {
            return "Без группы";
        }
        return obj.accrual_group_id !== null || obj.accrual_group_id !== "0" ?
                obj.accrual_group_name
            :   "Без группы";
    }

    if (isSheet(obj)) {
        return `Смены`;
    }

    if (isReduction(obj)) {
        return obj.debt_id ? obj.debt_name : "Без задолженности";
    }

    if (isTax(obj)) {
        return "Налоги";
    }

    if (isTaxDeduction(obj)) {
        return "Налоговые вычеты";
    }

    if (isSocialFee(obj)) {
        return "Взносы";
    }

    if (isPayment(obj)) {
        return "Выплаты";
    }
}
