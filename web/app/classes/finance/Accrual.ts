import { addPrefixToObjectKeys } from "@/app/functions/objectKeys";
import { IDBEntityClass } from "../IDBEntityClass";
import { IdDateMapper } from "../IdDateMapper";
import {
    EFOConstructorObject,
    ExtendedFinanceObject,
} from "./ExtendedFinanceObject";

export type AccrualConstructorObject = EFOConstructorObject & {
    accrual_id: string;
    accrual_group_id: string | null;
    accrual_time: number | null;
};

export default class Accrual
    extends ExtendedFinanceObject
    implements IDBEntityClass<Accrual>
{
    accrual_id: string;
    accrual_group_id: string | null;

    accrual_time: number | null = null;

    constructor(object: AccrualConstructorObject, map?: IdDateMapper) {
        super(object, map);

        this.accrual_id = object.accrual_id;
        this.accrual_group_id = object.accrual_group_id;
        this.accrual_time = object.accrual_time;
    }

    createSQLObject() {
        const obj = {
            ...super.creatPlaneEfoObject(),
            accrual_id: this.accrual_id,
            accrual_group_id: this.accrual_group_id,
            accrual_time: this.accrual_time,
        };

        const prefixedObj = addPrefixToObjectKeys(obj, "accrual", [
            "accrual_group_id",
            "accrual_id",
            "accrual_time",
            "ids",
            "payslip_id",
        ]);

        return prefixedObj;
    }

    copy() {
        return new Accrual({ ...this }, this.idDateMap);
    }
}
