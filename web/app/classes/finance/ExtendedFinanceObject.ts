import { IdDateMapper } from "../IdDateMapper";
import { FoConstructorObject, FinanceObject } from "./FinanceObject";

export type EFOConstructorObject = {
    date: string;
    desc: string | null;
    user_id: string;
    [key: string]: any;
} & FoConstructorObject;

export class ExtendedFinanceObject extends FinanceObject {
    date: string;
    desc: string | null;
    user_id: string;
    idDateMap: IdDateMapper;

    constructor(object: EFOConstructorObject, map?: IdDateMapper) {
        super(object);

        this.date = object.date;
        this.desc = object.desc;

        this.user_id = object.user_id;

        this.idDateMap =
            map?.copy() || new IdDateMapper(this.user_id, this.date);
    }

    creatPlaneEfoObject() {
        const obj = {
            ...super.createPlaneFoObject(),
            date: this.date,
            desc: this.desc,
            user_id: this.user_id,
            ids: this.idDateMap.createSQLObject(),
        };
        return obj;
    }
}
