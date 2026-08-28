"use client";

import { use, useState } from "react";
import styles from "./css/login.module.scss";
import postLoginCredentials, {
    loginCredentialsResponsePayload,
} from "@/app/server-actions/auth/login/credentials/postLoginCredentials";
import { ApiResponse } from "@/app/server-actions/functions/types";
import postLoginCode, {
    loginCodeResponsePayload,
} from "@/app/server-actions/auth/login/code/postLoginCode";
import LoginBody from "./LoginBody";
import postCompanySelection, {
    finalAuthResponsePayload,
} from "@/app/server-actions/auth/login/company-selection/postCompanySelection";
import LoginButtons from "./LoginButtons";
import {
    changeAccessContextWithAuthPayload,
    ClientAccessStateContext,
} from "@/app/context/auth/ClientAccessStateContext";
import { useRouter } from "next/navigation";
import setAccessStateCookies from "@/app/server-actions/auth/cookies/setAccessStateCookies";
import postCodeRefresh from "@/app/server-actions/auth/reg/user/postCodeRefresh";

export type LoginCredentials = {
    username: string;
    password: string;
    code: string;
    user_id: string;
};

export type LoginPageStages = "password" | "code" | "company";

export default function LoginMain() {
    const [stage, setStage] = useState<LoginPageStages>("password");
    const [res, setRes] = useState<ApiResponse<
        | loginCredentialsResponsePayload
        | loginCodeResponsePayload
        | finalAuthResponsePayload
    > | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [isPending, setIsPending] = useState(false);

    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: "",
        password: "",
        code: "",
        user_id: "",
    });

    const accessState = use(ClientAccessStateContext);
    const router = useRouter();

    async function handlePostCredentials() {
        setIsPending(true);
        const response = await postLoginCredentials(credentials);
        if (response.code === 200) {
            setError(null);
            setRes(response);
            setStage("company");
        } else {
            setError(response.error_code);
        }
        setIsPending(false);
    }
    async function handlePostCodeRefresh() {
        if (!res?.data[0] || !("token" in res?.data[0]) || !res?.data[0]?.token)
            return;
        setIsPending(true);
        const response = await postCodeRefresh(res.data[0]);
        if (response.code !== 200) {
            setError(response.error_code);
        }
        setIsPending(false);
    }
    async function handlePostCode() {
        if (!res?.data[0] || !("token" in res?.data[0]) || !res?.data[0]?.token)
            return;
        setIsPending(true);
        const response = await postLoginCode({
            token: res?.data[0]?.token,
            code: credentials.code,
        });
        if (response.code === 200) {
            setError(null);
            setRes(response);
            setStage("company");
        } else {
            setError(response.error_code);
        }
        setIsPending(false);
    }

    async function handleCompanySelection() {
        if (!res?.data[0] || !("token" in res?.data[0]) || !res?.data[0]?.token)
            return;
        setIsPending(true);
        const response = await postCompanySelection({
            user_id: credentials.user_id,
            token: res?.data[0]?.token,
        });
        if (response.code === 200 && response.data[0]) {
            setError(null);
            await setAccessStateCookies(response.data[0]);
            changeAccessContextWithAuthPayload(
                response.data[0],
                accessState.setter,
            );
            router.replace(
                response.data[0].access_level === "admin" ?
                    "/company"
                :   "/my/profile",
            );
        } else {
            setIsPending(false);
            setError(response.error_code);
        }
    }

    const isValid = () => {
        switch (stage) {
            case "password":
                return true;
            case "code":
                return credentials.code !== "";
            case "company":
                return credentials.user_id !== "";
        }
    };

    return (
        <div className={styles.login_page}>
            <form className={styles.login_form}>
                <div className={styles.main_div}>
                    <div className={styles.header}>Вход</div>
                    <div className={styles.content}>
                        <LoginBody
                            credentials={credentials}
                            setCredentials={setCredentials}
                            res={res}
                            stage={stage}
                        />
                    </div>
                    <div className={styles.error_div}>
                        {error && <ErrorText error={error} />}
                    </div>
                    <div className={styles.buttons_div}>
                        <LoginButtons
                            stage={stage}
                            isPending={isPending}
                            isValid={isValid()}
                            handlePostCredentials={handlePostCredentials}
                            handlePostCodeRefresh={handlePostCodeRefresh}
                            handlePostCode={handlePostCode}
                            handleCompanySelection={handleCompanySelection}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

function ErrorText({ error }: { error: string | null }) {
    if (!error) return "";

    const InnerText = () => {
        switch (error) {
            case "AUTH-LOGIN-CREDENTIALS":
                return "Неверный логин или пароль.";
            case "AUTH-CODE-INVALID":
                return "Неверный код.";
            case "AUTH-CODE-EXPIRED":
                return "Код устарел.";
            case "AUTH-CODE-LIMIT":
                return "Превышен лимит попыток. Попробуйте после 00:00 UTC.";
            case "AUTH-CODE-EARLY":
                return "Попробуйте через минуту.";
            default:
                return "Ошибка при входе.";
        }
    };

    return (
        <div className={styles.error}>
            <div className={styles.error_header}>{`Ошибка! (${error})`}</div>
            <div className={styles.error_text}>
                <InnerText />
                <span>{` Если ошибка повторяется, пожалуйста, сделайте скриншот этой страницы и напишите в поддержку.`}</span>
            </div>
        </div>
    );
}
