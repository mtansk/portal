import { parseFloatAny } from "@/app/functions/other";

export function errorOnNaN(value: unknown): never | void {
    if (value === "" || value === null || value === undefined) {
        return;
    }

    if (typeof value === "number") {
        if (isNaN(value)) {
            throw new Error("Value is NaN");
        }
    }
    if (typeof value === "string") {
        const parsed = parseFloatAny(value);
        if (isNaN(parsed)) {
            throw new Error("Value is NaN");
        }
    }
}

export default class ComputableObject {
    qty: string | undefined; // dep
    rate: string | undefined; // dep

    total: number; // calc

    constructor(
        qty: string | number | undefined,
        rate: string | number | undefined,
    ) {
        this.qty = qty?.toString();
        this.rate = rate?.toString();

        this.total = 0;

        this.reCalculate();
    }

    reCalculate() {
        if (!this.qty || !this.rate) {
            this.total = 0;
            return;
        }
        this.total = parseFloatAny(this.qty) * parseFloatAny(this.rate);
        this.total = parseFloatAny(this.total, 2);
    }

    protected setter(name: "qty" | "rate", value: number | string | null) {
        if (
            name in this &&
            (typeof value === "number" ||
                typeof value === "string" ||
                value === "")
        ) {
            if (typeof value === "string") {
                if (value === "") {
                    this[name] = undefined;
                    this.reCalculate();
                    return;
                }
            }

            this[name] = value.toString();
            this.reCalculate();

            /* let parsedValue: number;

            if (typeof value === "string") {
                if (value === "") {
                    this[name] = undefined;
                    this.reCalculate();
                    this.checkValidity();
                    return;
                }
                parsedValue = parseFloat(value);
            } else {
                parsedValue = value;
            }

            if (!isNaN(parsedValue) || parsedValue == 0) {
                this[name] = parsedValue;
                this.reCalculate();
                this.checkValidity();
            } */
        }
    }
}
