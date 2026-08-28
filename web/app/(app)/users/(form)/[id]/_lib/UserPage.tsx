"use client";

import { ApiUser } from "@/app/types/user/Users";

import styles from "./css/user-page.module.scss";
import FormHeader from "@/app/components/form/header/FormHeader";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import AccountSettings from "./AccountSettings";
import { EFONames } from "@/app/types/finance/other/FinanceTypes";
import UserObjectsLink from "./UserObjectsLink";
import { startTransition, Suspense, useState } from "react";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import UserForm from "./UserForm";
import { ApiDept } from "@/app/types/depts/Depts";
import { useSearchParams } from "next/navigation";
import { Link } from "react-transition-progress/next";
import { Button } from "@/app/components/buttons/Buttons";
import { useServerAction } from "@/app/components/hooks/useServerAction";
import { useProgress } from "react-transition-progress";
import { postRecoverUser } from "@/app/server-actions/users/postRecoverUser";

export default function UserPage({
    user,
    depts,
}: {
    user: ApiUser;
    depts: ApiDept[];
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const serverAction = useServerAction();
    const startProgress = useProgress();

    async function handleRecoverClick() {
        startTransition(() => {
            startProgress();
            serverAction({
                serverAction: () => postRecoverUser({ user_id: user.user_id }),
                showSuccess: true,
            });
        });
    }

    return (
        <>
            {dialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <UserForm
                        initialUser={user}
                        depts={depts}
                        type="edit"
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                    />
                </ModalPortal>
            )}

            <div className={styles.main_div}>
                <div className={styles.block}>
                    <div className={styles.dept}>{user.department_name}</div>
                    <div
                        className={styles.name}
                    >{`${user.last_name || ""} ${user.first_name} ${user.middle_name || ""}`}</div>
                    <div className={styles.title}>{user.user_title}</div>
                </div>
                <div className={styles.contacts}>
                    <FormHeader title="Контакты" />
                    <InputWrapper
                        label="Телеграм"
                        required={false}
                        isDisabled={true}
                    >
                        <div className={styles.contact}>
                            {user.user_telegram || "Нет"}
                        </div>
                    </InputWrapper>
                    <InputWrapper
                        label="Телефон"
                        required={false}
                        isDisabled={true}
                    >
                        <div className={styles.contact}>
                            {user.user_phone || "Нет"}
                        </div>
                    </InputWrapper>
                    <InputWrapper
                        label="Почта"
                        required={false}
                        isDisabled={true}
                    >
                        <div className={styles.contact}>
                            {user.user_email || "Нет"}
                        </div>
                    </InputWrapper>
                </div>
                {user.deleted_at === null && (
                    <div className={styles.account}>
                        <AccountSettings user={user} />
                    </div>
                )}
                <div className={styles.links}>
                    <FormHeader
                        title={`Объекты сотрудника`}
                        headerLike={false}
                    />
                    <div className={styles.links_div}>
                        {(
                            [
                                "accrual",
                                "reduction",
                                "payment",
                                "payslip",
                                "debt",
                            ] as (EFONames | "payslip" | "debt")[]
                        ).map((o) => {
                            return (
                                <UserObjectsLink
                                    key={o}
                                    user={user}
                                    object={o}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className={styles.buttons_div}>
                    {user.deleted_at ?
                        <Button
                            type="nav"
                            colors="nav-purple"
                            onClick={handleRecoverClick}
                            innerContent="Восстановить"
                        />
                    :   <Button
                            type="filled"
                            colors="filled-gray"
                            onClick={() => setDialogIsOpen(true)}
                            innerContent="Изменить"
                        />
                    }
                    <Suspense>
                        <BackButton />
                    </Suspense>
                </div>
            </div>
        </>
    );
}

function BackButton() {
    const backurl = useSearchParams().get("backurl");

    return (
        <Button
            type="filled"
            colors="nav-blue"
            href={backurl || "/users"}
            innerContent="Назад"
        />
    );
}
