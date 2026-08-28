export const defaultAccrualGroupObject = {
    accrual_group_id: "dummy_id",
    accrual_group_name: "",
};

export type ApiAccrualGroup = IDBAccrualGroup;

export type NullableAccrualGroup = Omit<IDBAccrualGroup, "accrual_group_id"> & {
    accrual_group_id: string | null;
};

export interface IDBAccrualGroup {
    accrual_group_id: string;
    accrual_group_name: string;
}
