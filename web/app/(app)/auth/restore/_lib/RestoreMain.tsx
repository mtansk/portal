"use client";

import { useState } from "react";
import styles from "./css/login.module.scss";
import { useRouter } from "next/navigation";
import { AuthEmailInput, AuthNameInput } from "../../_lib/inputs/AuthInputs";
import postRestoreCredentials from "@/app/server-actions/auth/restore/postRestoreCredentials";
import { Button } from "@/app/components/buttons/Buttons";
import AuthError from "../../_lib/error-div/AuthError";
import { Link } from "react-transition-progress/next";

export type RestoreCredentials = {
    email: string;
    first_name: string;
};

export default function RestoreMain() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const [credentials, setCredentials] = useState<RestoreCredentials>({
        email: "",
        first_name: "",
    });

    const router = useRouter();

    async function handlePostCredentials() {
        setIsPending(true);
        const response = await postRestoreCredentials(credentials);
        if (response.code === 200) {
            router.replace("/auth/login");
        } else {
            setError(response.error_code);
        }
        setIsPending(false);
    }

    return (
        <div className={styles.login_page}>
            <form className={styles.login_form}>
                <div className={styles.main_div}>
                    <div className={styles.header}>Восстановление</div>
                    <div className={styles.content}>
                        <div className={styles.restore_div}>
                            <AuthEmailInput
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <AuthNameInput
                                value={credentials.first_name}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        first_name: e.target.value,
                                    })
                                }
                            />
                            <div className={styles.note}>
                                {`Если вы введете правильные данные, новый пароль придет на вашу почту.
                                Имя должно быть таким же, как в вашем аккаунте, а не у вашего сотрудника.`}
                            </div>
                        </div>
                    </div>
                    <div className={styles.error_div}>
                        {error && <AuthError error={error} />}
                    </div>
                    <div className={styles.buttons_div}>
                        <Link
                            href="/auth/login"
                            className={styles.login_button}
                        >
                            Вход
                        </Link>
                        <Button
                            type="filled"
                            colors="submit-gray"
                            innerContent="Восстановить"
                            onClick={handlePostCredentials}
                            isPending={isPending}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
