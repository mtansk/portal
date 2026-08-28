import { IDBEntityClass } from "../IDBEntityClass";

export type PayslipConstructorObject = {
    payslip_id: string;
    payslip_date: string;
    payslip_name: string;
    payslip_st_date: string;
    payslip_en_date: string;
    user_id: string;
};

export class Payslip implements IDBEntityClass<Payslip> {
    payslip_id: string;
    payslip_date: string;
    payslip_name: string;
    payslip_st_date: string;
    payslip_en_date: string;
    user_id: string;

    public constructor({
        payslip_id,
        payslip_date,
        payslip_name,
        payslip_st_date,
        payslip_en_date,
        user_id,
    }: PayslipConstructorObject) {
        this.payslip_id = payslip_id;
        this.payslip_date = payslip_date;
        this.payslip_name = payslip_name;

        this.payslip_st_date = payslip_st_date;
        this.payslip_en_date = payslip_en_date;
        this.user_id = user_id;
    }

    createSQLObject(): object {
        throw new Error("Method not implemented.");
    }

    copy(): Payslip {
        throw new Error("Method not implemented.");
    }
}
