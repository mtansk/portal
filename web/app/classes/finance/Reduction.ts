import { IDBEntityClass } from "../IDBEntityClass";
import { ExtendedFinanceObject } from "./ExtendedFinanceObject";
import { EFOConstructorObject } from "./ExtendedFinanceObject";
import { IdDateMapper } from "../IdDateMapper";
import { addPrefixToObjectKeys } from "../../functions/objectKeys";

export type SQLObject<T extends IDBEntityClass<T>> = ReturnType<
    T["createSQLObject"]
>;

export type ReductionConstructorObject = EFOConstructorObject & {
    reduction_id: string;
    debt_id: string | null;
};

export default class Reduction
    extends ExtendedFinanceObject
    implements IDBEntityClass<Reduction>
{
    reduction_id: string;
    debt_id: string | null;

    constructor(object: ReductionConstructorObject, map?: IdDateMapper) {
        super(object, map);

        this.reduction_id = object.reduction_id;
        this.debt_id = object.debt_id;
    }

    createSQLObject() {
        const obj = {
            ...super.creatPlaneEfoObject(),
            reduction_id: this.reduction_id,
            debt_id: this.debt_id,
        };

        const prefixedObj = addPrefixToObjectKeys(obj, "reduction", [
            "debt_id",
            "reduction_id",
            "payslip_id",
            "ids",
        ]);

        return { ...prefixedObj, ...obj };
    }

    copy() {
        return new Reduction({ ...this }, this.idDateMap);
    }
}
