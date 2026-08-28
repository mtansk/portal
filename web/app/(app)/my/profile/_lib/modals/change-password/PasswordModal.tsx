import styles from "./password.module.scss";
import { useEffect, useRef, useState } from "react";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import DummyInput from "@/app/components/inputs/DummyInput";
import putMyPassword from "@/app/server-actions/my/accounts/putMyPassword";

import { useServerAction } from "@/app/components/hooks/useServerAction";
import SubmitButton from "../../../../../../components/buttons/submit-button/SubmitButton";
import setAccessStateCookies from "@/app/server-actions/auth/cookies/setAccessStateCookies";

export type PasswordChangeFormObject = {
    currentPassword: string;
    password: string;
    passwordRepeat: string;
};

export default function PasswordModal({
    setDialogIsOpen,
}: {
    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const [credentials, setCredentials] = useState<PasswordChangeFormObject>({
        currentPassword: "",
        password: "",
        passwordRepeat: "",
        /*        currentPassword: "12345678",
        password: "12345678",
        passwordRepeat: "12345678", */
    });

    const [isPending, setIsPending] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const serverAction = useServerAction();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(
        () => setIsValid(formRef.current?.checkValidity() ?? false),
        [credentials],
    );

    async function handleSaveClick() {
        setIsPending(true);
        const res = await serverAction({
            serverAction: () => putMyPassword(credentials),
            showSuccess: true,
        });
        if (res.ok) {
            await setAccessStateCookies(res.data[0]);
            setDialogIsOpen(false);
        }
        setIsPending(false);
    }

    return (
        <form ref={formRef}>
            <div className={styles.main_div}>
                <div className={styles.header}>Изменение пароля</div>
                <input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    aria-hidden="true"
                    hidden={true}
                />
                <InputWrapper
                    label="Текущий пароль"
                    isDisabled={false}
                    required={false}
                    id="currentPassword"
                    className={styles.current}
                >
                    <input
                        type="password"
                        value={credentials.currentPassword}
                        onChange={(e) => {
                            setCredentials({
                                ...credentials,
                                currentPassword: e.target.value,
                            });
                        }}
                        placeholder=""
                        required={true}
                        id="currentPassword"
                        autoComplete="password"
                        className={styles.input}
                    />
                </InputWrapper>
                <InputWrapper
                    label="Новый пароль"
                    isDisabled={false}
                    required={false}
                    id="password"
                    lengthOptions={{
                        current: credentials.password.length,
                        max: 100,
                    }}
                    className={styles.new}
                >
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => {
                            setCredentials({
                                ...credentials,
                                password: e.target.value,
                            });
                        }}
                        placeholder=""
                        pattern="^[\x20-\x7E]{8,}$"
                        required={true}
                        id="password"
                        autoComplete="new-password"
                        className={styles.input}
                        minLength={8}
                    />
                </InputWrapper>
                <div className={styles.note}>Не менее 8 символов</div>
                <InputWrapper
                    label="Повторите новый пароль"
                    isDisabled={false}
                    required={false}
                    id="password-repeat"
                    className={styles.wrapper}
                    lengthOptions={{
                        current: credentials.passwordRepeat.length,
                        max: 100,
                    }}
                >
                    <input
                        type="password"
                        value={credentials.passwordRepeat}
                        onChange={(e) => {
                            setCredentials({
                                ...credentials,
                                passwordRepeat: e.target.value,
                            });
                        }}
                        placeholder=""
                        pattern="^[\x20-\x7E]{8,}$"
                        required={true}
                        id="password-repeat"
                        autoComplete="new-password"
                        className={styles.input + " " + styles.password}
                        minLength={8}
                    />
                </InputWrapper>
                <DummyInput
                    value={
                        credentials.password === credentials.passwordRepeat ?
                            "1"
                        :   ""
                    }
                />
                <div className={styles.button_div}>
                    <SubmitButton
                        text="Сохранить"
                        onClick={async () => {
                            await handleSaveClick();
                        }}
                        isDisabled={!isValid || isPending}
                        isPending={isPending}
                    />
                </div>
            </div>
        </form>
    );
}
