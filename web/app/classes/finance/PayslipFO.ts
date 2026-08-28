import { addPrefixToObjectKeys } from "@/app/functions/objectKeys";
import { FinanceObject, FoConstructorObject } from "./FinanceObject";

export type PayslipFOConstructorObject = FoConstructorObject & {
    is_round: 0 | 1;
};

export class PayslipFO extends FinanceObject {
    public is_round: 0 | 1 = 0;

    public constructor(obj: PayslipFOConstructorObject) {
        super(obj);
        this.is_round = obj.is_round;
    }

    public setterFn(name: keyof this, value: number | string) {
        super.setterFn(name, value);
        if (this.is_round) {
            this.total = Math.round(this.total);
        }
    }

    public copy() {
        return new PayslipFO({ ...this });
    }

    public createSQLObject(prefix: "tax" | "social_fee" | "tax_deduction") {
        const obj = {
            ...super.createPlaneFoObject(),
            is_round: this.is_round,
        };

        const prefixedObj = addPrefixToObjectKeys(obj, prefix, ["payslip_id"]);

        const extendedObj = {
            ...prefixedObj,
            ...obj,
        };

        return extendedObj;
    }
}
