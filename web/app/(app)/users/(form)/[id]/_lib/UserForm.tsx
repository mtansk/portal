"use client";

import FormHandler from "@/app/components/form/FormHandler";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import { ApiDept } from "@/app/types/depts/Depts";
import { IDBUser } from "@/app/types/user/Users";
import styles from "./css/user-form.module.scss";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { putUser } from "@/app/server-actions/users/putUser";
import FormHeader from "@/app/components/form/header/FormHeader";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import { postUser } from "@/app/server-actions/users/postUser";
import { postDeleteUser } from "@/app/server-actions/users/postDeleteUser";

export type FormUser = IDBUser & {
    post_invite?: boolean;
};

export default function UserForm({
    initialUser,
    depts,

    type,
    view,

    setDialogIsOpen,
}: {
    initialUser: FormUser;
    depts: ApiDept[];

    type: FormTypes;
    view: "modal" | "page";

    setDialogIsOpen?: (dialogIsOpen: boolean) => void;
}) {
    const {
        actionType,
        setActionType,
        object: user,
        setObject: setUser,
        isDisabled,
    } = useFormHandler(initialUser, type);

    return (
        <FormHandler
            object={user}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            title="Сотрудник"
            actions={{
                putAction: async () => putUser(user),
                postAction: async () => postUser(user),
                deleteAction: async () => postDeleteUser(user),
            }}
            onActionSuccess={() => setDialogIsOpen?.(false)}
            setDialogIsOpen={setDialogIsOpen}
            deleteDialogOptions={{
                deleteDialogText: <UserDeleteDialogText />,
            }}
            pathOptions={{
                redirectOnAdd: true,
            }}
        >
            <div className={styles.main_div + " " + styles[type]}>
                <div className={styles.names}>
                    {type === "add" && <FormHeader title="ФИО" />}
                    <InputWrapper
                        isDisabled={isDisabled}
                        required={false}
                        label="Фамилия"
                        id="last_name"
                    >
                        <input
                            type="text"
                            value={user.last_name || ""}
                            onChange={(e) =>
                                setUser({ ...user, last_name: e.target.value })
                            }
                            name="last_name"
                            id="last_name"
                            disabled={isDisabled}
                            maxLength={30}
                            placeholder="Фамилия"
                        />
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={isDisabled}
                        required={true}
                        label="Имя"
                        id="first_name"
                    >
                        <input
                            type="text"
                            value={user.first_name}
                            onChange={(e) =>
                                setUser({ ...user, first_name: e.target.value })
                            }
                            name="first_name"
                            id="first_name"
                            disabled={isDisabled}
                            maxLength={30}
                            required={true}
                            placeholder="Имя"
                        />
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={isDisabled}
                        required={false}
                        label="Отчество"
                        id="middle_name"
                    >
                        <input
                            type="text"
                            value={user.middle_name || ""}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    middle_name: e.target.value,
                                })
                            }
                            name="middle_name"
                            id="middle_name"
                            disabled={isDisabled}
                            maxLength={30}
                            placeholder="Отчество"
                        />
                    </InputWrapper>
                </div>
                <div className={styles.dept}>
                    {type === "add" && <FormHeader title="Отдел и должность" />}
                    <InputWrapper
                        isDisabled={isDisabled}
                        required={true}
                        label="Отдел"
                        id="department_id"
                    >
                        <select
                            value={user.department_id}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    department_id: e.target.value,
                                })
                            }
                            name="department_id"
                            id="department_id"
                            disabled={isDisabled}
                            required={true}
                        >
                            <option
                                value=""
                                disabled
                            >
                                Выберите отдел
                            </option>
                            {depts.map((dept) => (
                                <option
                                    key={dept.department_id}
                                    value={dept.department_id}
                                >
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={isDisabled}
                        required={true}
                        label="Должность"
                        id="user_title"
                        lengthOptions={{
                            current: user.user_title?.length || 0,
                            max: 50,
                        }}
                    >
                        <textarea
                            value={user.user_title || ""}
                            onChange={(e) =>
                                setUser({ ...user, user_title: e.target.value })
                            }
                            name="user_title"
                            id="user_title"
                            disabled={isDisabled}
                            required={true}
                            maxLength={50}
                            placeholder="Должность"
                        />
                    </InputWrapper>
                </div>
                <div className={styles.contacts}>
                    {type === "add" && <FormHeader title="Контакты" />}
                    <InputWrapper
                        isDisabled={isDisabled}
                        required={false}
                        label="Телеграм"
                        id="user_telegram"
                    >
                        <input
                            type="text"
                            value={user.user_telegram || ""}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    user_telegram: e.target.value,
                                })
                            }
                            name="user_telegram"
                            id="user_telegram"
                            disabled={isDisabled}
                            maxLength={30}
                            placeholder="@username"
                        />
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={isDisabled}
                        required={false}
                        label="Телефон"
                        id="user_phone"
                    >
                        <input
                            type="text"
                            value={user.user_phone || ""}
                            onChange={(e) =>
                                setUser({ ...user, user_phone: e.target.value })
                            }
                            name="user_phone"
                            id="user_phone"
                            disabled={isDisabled}
                            maxLength={30}
                            placeholder="89990001122"
                        />
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={isDisabled}
                        required={false}
                        label="Почта"
                        id="user_email"
                    >
                        <input
                            type="text"
                            value={user.user_email || ""}
                            onChange={(e) =>
                                setUser({ ...user, user_email: e.target.value })
                            }
                            name="user_email"
                            id="user_email"
                            disabled={isDisabled}
                            maxLength={30}
                            placeholder="mail@example.com"
                        />
                    </InputWrapper>
                </div>
                {type === "add" && (
                    <div className={styles.account}>
                        {type === "add" && <FormHeader title="Аккаунт" />}
                        <div className={styles.checkbox}>
                            <CustomCheckbox
                                text="Активировать аккаунт"
                                value={user.post_invite || false}
                                onChange={(b) =>
                                    setUser({ ...user, post_invite: b })
                                }
                                isDisabled={isDisabled}
                                className={styles.checkbox_text}
                            />
                        </div>
                        <div className={styles.note}>
                            <>
                                Активируйте аккаунт, чтобы сотрудник мог
                                зарегистрироваться в сервисе или подключить
                                существующий аккаунт. При активации система
                                сгенерирует код, который нужно будет сообщить
                                сотруднику для регистрации. Код действует в
                                течение суток.
                            </>
                        </div>
                    </div>
                )}
            </div>
        </FormHandler>
    );
}

function UserDeleteDialogText() {
    return (
        <>
            <div
                style={{
                    fontWeight: "500",
                }}
            >
                Вы действительно хотите удалить сотрудника?
            </div>
            <div>
                Его аккаунт (при наличии) будет отключен, но не удален.
                Сотрудник не сможет входить в систему, но сможет выгрузить все
                свои данные и историю их изменений.
            </div>
            <div>
                {`Сотрудника можно будет восстановить в разделе Сотрудники -> Корзина.`}
            </div>
        </>
    );
}
