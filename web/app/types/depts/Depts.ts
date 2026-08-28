export const defaultDeptObject: IDBDept = {
    department_id: "dummy_id",
    department_name: "",
    department_color: "#efdfff",
};

export type ApiDept = IDBDept;

export interface IDBDept {
    department_id: string;
    department_name: string;
    department_color: string;
}

export type ApiMyDepartment = IDBDept;
