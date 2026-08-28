import { FormUser } from "@/app/(app)/users/(form)/[id]/_lib/UserForm";
import { AccessLevels, AccountStatuses } from "../access/Access";

export const defaultUserObject: FormUser = {
    user_id: "dummy_id",
    first_name: "",
    last_name: "",
    middle_name: "",
    user_title: "",
    user_email: "",
    user_phone: "",
    user_telegram: "",
    access_level: null,
    account_status: null,
    account_id: null,
    created_at: "",
    deleted_at: null,
    department_id: "",
};

export type ApiUser = IDBUser & {
    department_name: string;
    department_color: string;
} & {
    invite_id: string | null;
    invite_code: string | null;
    expires_at: string | null;
};

export interface IDBUser {
    user_id: string;

    first_name: string;
    last_name: string | null;
    middle_name: string | null;
    user_title: string | null;

    user_email: string | null;
    user_phone: string | null;
    user_telegram: string | null;

    access_level: AccessLevels | null;
    account_status: AccountStatuses | null;
    account_id: string | null;
    created_at: string;
    deleted_at: string | null;
    department_id: string;
}

export type ApiMyUser = IDBUser & {
    company_name: string;
    company_id: string;
} & {
    department_name: string;
    department_color: string;
};

export type ApiMyColleague = {
    user_id: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    user_title: string;
    user_email: string;
    user_phone: string;
    user_telegram: string;
    access_level: AccessLevels;
    created_at: string;
    deleted_at: string | null;
    company_id: string;

    department_id: string;
    department_name: string;
    department_color: string;
};
