import { IDBDept } from "@/app/types/depts/Depts";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import { ApiUser } from "@/app/types/user/Users";

import styles from "./css/department-form.module.scss";
import FormHandler, {
    DeleteDialogOptions,
} from "@/app/components/form/FormHandler";
import { DeptNameInput } from "@/app/components/inputs/defaults/dept-name/DeptNameInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import putDept from "@/app/server-actions/departments/putDept";
import postDept from "@/app/server-actions/departments/postDept";
import { useMemo } from "react";

export type FormDept = IDBDept;

export default function DepartmentForm({
    initialDept,
    users,

    type,
    view,

    setDialogIsOpen,
}: {
    initialDept: FormDept;
    users?: ApiUser[];

    type: FormTypes;
    view: "page" | "modal";

    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const {
        object: dept,
        setObject,
        actionType,
        isDisabled,
        setActionType,
    } = useFormHandler(initialDept, type);

    function handleChange(
        e:
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>,
    ) {
        setObject({
            ...dept,
            [e.target.name]: e.target.value,
        });
    }

    const deptUsers = useMemo(
        () =>
            users?.filter(
                (user) => user.department_id === dept.department_id,
            ) ?? [],
        [users, dept.department_id],
    );

    const dialogOptions = (): DeleteDialogOptions => {
        return {
            deleteDialogText: `Удаление отделов невозможно в целях сохранения целостности данных. 
                Вы можете убрать всех сотрудников из отдела, чтобы он не отображался 
                нигде, кроме этой страницы.`,
            isDisabled: true,
        };
    };

    return (
        <FormHandler
            object={dept}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            setDialogIsOpen={setDialogIsOpen}
            title="Отдел"
            actions={{
                putAction: async () => putDept(dept),
                postAction: async () => postDept(dept),
            }}
            deleteDialogOptions={dialogOptions()}
        >
            <div className={styles.main_div}>
                <div className={styles.name}>
                    <DeptNameInput
                        onChange={handleChange}
                        value={dept.department_name}
                        isDisabled={isDisabled}
                        name="department_name"
                    />
                </div>

                <div className={styles.select}>
                    <InputWrapper
                        isDisabled={isDisabled}
                        label="Цвет в графике"
                        id="color-select"
                        required={true}
                    >
                        <select
                            name="department_color"
                            value={dept.department_color}
                            onChange={handleChange}
                            id="color-select"
                            disabled={isDisabled}
                        >
                            {departmentsColors.map((color) => (
                                <option
                                    key={color.name}
                                    value={color.color}
                                >
                                    {color.name}
                                </option>
                            ))}
                        </select>
                    </InputWrapper>
                </div>
                <div
                    className={styles.color_box}
                    style={{ backgroundColor: dept.department_color }}
                ></div>
            </div>
        </FormHandler>
    );
}

type ColorObject = {
    name: string;
    color: string;
};

export const departmentsColors: ColorObject[] = [
    { name: "Фиолетовый", color: "#efdfff" },
    { name: "Зеленый", color: "#def3db" },
    { name: "Оранжевый", color: "#fae6d5" },
    { name: "Голубой", color: "#cbe0f7" },
    { name: "Желтый", color: "#f0e5a8" },
    { name: "Розовый", color: "#f7d1e5" },
    { name: "Фиалковый", color: "#cdcaec" },
];
