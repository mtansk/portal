import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { ApiMyAccount } from "@/app/types/access/Accounts";
import styles from "./../page/css/body.module.scss";
import { useState } from "react";
import { ModalPortal } from "@/app/components/form/ModalPortal";

import AccountCredentialsModal from "../modals/change-credentials/AccountCredentialsModal";
import PasswordModal from "../modals/change-password/PasswordModal";
import { Link } from "react-transition-progress/next";

export default function AccountBlock({ account }: { account: ApiMyAccount }) {
    const [credentialsDialogIsOpen, setCredentialsDialogIsOpen] =
        useState(false);
    const [passwordDialogIsOpen, setPasswordDialogIsOpen] = useState(false);

    return (
        <>
            {credentialsDialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={credentialsDialogIsOpen}
                    setDialogIsOpen={setCredentialsDialogIsOpen}
                >
                    <AccountCredentialsModal
                        initialAccount={account}
                        setDialogIsOpen={setCredentialsDialogIsOpen}
                    />
                </ModalPortal>
            )}
            {passwordDialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={passwordDialogIsOpen}
                    setDialogIsOpen={setPasswordDialogIsOpen}
                >
                    <PasswordModal setDialogIsOpen={setPasswordDialogIsOpen} />
                </ModalPortal>
            )}
            <div className={styles.block}>
                <div className={styles.header}>Данные аккаунта</div>
                <div className={styles.header_note}>
                    Эти данные принадлежат вашему аккаунту, их не видит никто,
                    кроме вас.
                </div>
                <div className={styles.block_body}>
                    <InputWrapper
                        isDisabled={true}
                        label="Имя"
                    >
                        <div className={styles.input}>{account.first_name}</div>
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={true}
                        label="Электронная почта"
                    >
                        <div className={styles.input}>
                            {account.account_email}
                        </div>
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={true}
                        label="Телеграм"
                    >
                        <div className={styles.input}>
                            {account.account_telegram || "Нет"}
                        </div>
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={true}
                        label="ID"
                    >
                        <div className={styles.input_small}>
                            {account.account_id || "-"}
                        </div>
                    </InputWrapper>
                    <InputWrapper
                        isDisabled={true}
                        label="Создан"
                    >
                        <div className={styles.input_small}>
                            {`${account.created_at} UTC` || "-"}
                        </div>
                    </InputWrapper>
                </div>
                <div className={styles.actions}>
                    <button
                        className={styles.button_good}
                        onClick={() => setCredentialsDialogIsOpen(true)}
                    >
                        Изменить данные
                    </button>
                    <button
                        className={styles.button_good}
                        onClick={() => setPasswordDialogIsOpen(true)}
                    >
                        Изменить пароль
                    </button>
                    <Link
                        className={styles.button_bad}
                        href={"/auth/logout"}
                        prefetch={false}
                    >
                        Выйти
                    </Link>
                </div>
            </div>
        </>
    );
}
