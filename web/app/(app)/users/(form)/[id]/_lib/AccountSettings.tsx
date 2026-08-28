"use client";

import { ApiUser } from "@/app/types/user/Users";
import styles from "./css/account-settings.module.scss";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { sqlTimestampToUTCDate } from "@/app/functions/dates";
import postInvite from "@/app/server-actions/access/invites/postInvite";
import deleteInvite from "@/app/server-actions/access/invites/deleteInvite";
import { accessLevelString } from "@/app/functions/users";
import { useServerAction } from "@/app/components/hooks/useServerAction";
import { useProgress } from "react-transition-progress";
import { startTransition, useState } from "react";
import { postSuspendUser } from "@/app/server-actions/users/postSuspendUser";
import { postActivateUser } from "@/app/server-actions/users/postActivateUser";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import AccessLevelModal from "./AccessLevelModal";

export default function AccountSettings({ user }: { user: ApiUser }) {
    const [levelDialogIsOpen, setLevelDialogIsOpen] = useState(false);
    return (
        <>
            {levelDialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={levelDialogIsOpen}
                    setDialogIsOpen={setLevelDialogIsOpen}
                >
                    <AccessLevelModal
                        user={user}
                        setDialogIsOpen={setLevelDialogIsOpen}
                    />
                </ModalPortal>
            )}
            <div className={styles.account_div + " " + styles.active}>
                <div className={styles.header}>Аккаунт</div>
                <InnerContent
                    user={user}
                    setDialogIsOpen={setLevelDialogIsOpen}
                />
            </div>
        </>
    );
}

function InnerContent({
    user,
    setDialogIsOpen,
}: {
    user: ApiUser;
    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const serverAction = useServerAction();
    const startProgress = useProgress();

    if (user.account_status === "active") {
        async function handleSuspendClick() {
            startTransition(() => {
                startProgress();
                serverAction({
                    serverAction: async () =>
                        await postSuspendUser({ user_id: user.user_id }),
                    showSuccess: true,
                });
            });
        }

        return (
            <>
                <div className={styles.status}>
                    <InputWrapper
                        label="Статус аккаунта"
                        required={false}
                        isDisabled={true}
                    >
                        <div
                            className={
                                styles.status_label + " " + styles.active
                            }
                        >
                            Активен
                        </div>
                    </InputWrapper>
                </div>
                <div className={styles.access_level}>
                    <InputWrapper
                        label="Уровень доступа"
                        required={false}
                        isDisabled={true}
                    >
                        {accessLevelString(user.access_level)}
                    </InputWrapper>
                </div>
                <div className={styles.status_info}>
                    Аккаунт активен и сотрудник может пользоваться всеми
                    доступными функциями.
                </div>
                <div className={styles.buttons}>
                    <button
                        type="button"
                        className={styles.good}
                        onClick={() => setDialogIsOpen(true)}
                    >
                        Изменить уровень доступа
                    </button>
                    <button
                        type="button"
                        className={styles.bad}
                        onClick={handleSuspendClick}
                    >
                        Отключить аккаунт
                    </button>
                </div>
            </>
        );
    }

    if (user.account_status === "suspended") {
        async function handleActivateClick() {
            startTransition(() => {
                startProgress();
                serverAction({
                    serverAction: async () =>
                        await postActivateUser({ user_id: user.user_id }),
                    showSuccess: true,
                });
            });
        }
        return (
            <>
                <div className={styles.status}>
                    <InputWrapper
                        label="Статус аккаунта"
                        required={false}
                        isDisabled={true}
                    >
                        <div
                            className={
                                styles.status_label + " " + styles.suspended
                            }
                        >
                            Отключен
                        </div>
                    </InputWrapper>
                </div>
                <div className={styles.status_info}>
                    Аккаунт отключен. Сотрудник может только скачивать свои
                    данные, внесенные до отключения, и не может пользоваться
                    функциями портала.
                </div>
                <div className={styles.buttons}>
                    <button
                        type="button"
                        className={styles.good}
                        onClick={handleActivateClick}
                    >
                        Активировать аккаунт
                    </button>
                </div>
            </>
        );
    }

    if (user.account_status === null && user.invite_id === null) {
        async function handleCreateInviteClick() {
            startTransition(() => {
                startProgress();
                serverAction({
                    serverAction: async () =>
                        await postInvite({ user_id: user.user_id }),
                    showSuccess: true,
                });
            });
        }

        return (
            <>
                <div className={styles.status}>
                    <InputWrapper
                        label="Статус аккаунта"
                        required={false}
                        isDisabled={true}
                    >
                        <div
                            className={styles.status_label + " " + styles.empty}
                        >
                            Не создан
                        </div>
                    </InputWrapper>
                </div>
                <div className={styles.status_info}>
                    Аккаунт не создан, сотрудник не может пользоваться порталом.
                    Активируйте аккаунт, чтобы сотрудник мог зарегистрироваться.
                </div>
                <div className={styles.buttons}>
                    <button
                        type="button"
                        className={styles.good}
                        disabled={false}
                        onClick={handleCreateInviteClick}
                    >
                        Активировать аккаунт
                    </button>
                </div>
            </>
        );
    }

    if (user.invite_id !== null) {
        const expiresDate = sqlTimestampToUTCDate(user.expires_at || "");

        async function handleDeleteClick() {
            startTransition(() => {
                startProgress();
                serverAction({
                    serverAction: async () =>
                        await deleteInvite(user.invite_id || ""),
                    showSuccess: true,
                });
            });
        }

        return (
            <>
                <div className={styles.status}>
                    <InputWrapper
                        label="Статус аккаунта"
                        required={false}
                        isDisabled={true}
                    >
                        <div
                            className={styles.status_label + " " + styles.empty}
                        >
                            Ожидает регистрации
                        </div>
                    </InputWrapper>
                    <InputWrapper
                        label="Код"
                        required={false}
                        isDisabled={true}
                    >
                        <div className={styles.code}>{user.invite_code}</div>
                    </InputWrapper>
                    <div
                        className={styles.expires}
                    >{`Действует до ${Intl.DateTimeFormat("ru", {
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "UTC",
                    }).format(expiresDate)}, ${Intl.DateTimeFormat("ru", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                    }).format(expiresDate)} UTC`}</div>
                </div>
                <div className={styles.status_info}>
                    Отправьте сотруднику код для регистрации. При регистрации
                    ему потребуется ввести код и имя сотрудника
                    {` (${user.first_name}). `}
                </div>
                <div className={styles.buttons}>
                    <button
                        type="button"
                        className={styles.bad}
                        onClick={handleDeleteClick}
                    >
                        Отозвать приглашение
                    </button>
                </div>
            </>
        );
    }
}
