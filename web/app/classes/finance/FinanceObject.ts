import ComputableObject from "./ComputableObject";

export type FoConstructorObject = {
    name: string;
    id: string;
    payslip_id: string | null;
    qty: number | string | undefined;
    rate: number | string | undefined;
    [key: string]: any;
};

export class FinanceObject extends ComputableObject {
    name: string;
    id: string;
    payslip_id: string | null;

    constructor(object: FoConstructorObject) {
        super(object.qty, object.rate);

        this.name = object.name;
        this.id = object.id;
        this.payslip_id = object.payslip_id;
    }

    setterFn(name: keyof this, value: number | string | null) {
        if (name in this) {
            if (name === "qty" || name === "rate") {
                this.setter(name, value);
                return;
            }
            (this as any)[name] = value;
        }
    }

    createPlaneFoObject() {
        const obj = {
            id: this.id === "dummy_id" ? Math.random().toString() : this.id,
            name: this.name,
            qty: this.qty,
            rate: this.rate,
            total: this.total.toFixed(2),
            payslip_id: this.payslip_id,
        };

        return obj;
    }
}
