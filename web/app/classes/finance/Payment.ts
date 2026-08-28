import { addPrefixToObjectKeys } from "../../functions/objectKeys";
import { EFOConstructorObject } from "./ExtendedFinanceObject";
import { ExtendedFinanceObject } from "./ExtendedFinanceObject";
import { IDBEntityClass } from "../IDBEntityClass";
import { IdDateMapper } from "../IdDateMapper";

export type PaymentConstructorObject = EFOConstructorObject & {
    payment_id: string;
};

export default class Payment
    extends ExtendedFinanceObject
    implements IDBEntityClass<Payment>
{
    payment_id: string;

    constructor(object: PaymentConstructorObject, map?: IdDateMapper) {
        super({ ...object, qty: 1 }, map);

        this.payment_id = object.payment_id;
    }

    createSQLObject() {
        const obj = {
            ...super.creatPlaneEfoObject(),
            id:
                this.payment_id === "0" ?
                    Math.random().toString()
                :   this.payment_id,
        };

        const prefixedObj = {
            ...addPrefixToObjectKeys(obj, "payment", ["ids", "payslip_id"]),
            ...obj,
        };

        return prefixedObj;
    }

    copy() {
        return new Payment({ ...this }, this.idDateMap);
    }
}
