"use client";

import { use, useEffect, useRef, useState } from "react";
import styles from "./css/reg.module.scss";
import setAccessStateCookies from "@/app/server-actions/auth/cookies/setAccessStateCookies";
import { loginCodeResponsePayload } from "@/app/server-actions/auth/login/code/postLoginCode";
import { finalAuthResponsePayload } from "@/app/server-actions/auth/login/company-selection/postCompanySelection";
import { loginCredentialsResponsePayload } from "@/app/server-actions/auth/login/credentials/postLoginCredentials";
import { ApiResponse } from "@/app/server-actions/functions/types";

import UserRegBody from "./UserRegBody";
import UserRegButtons from "./UserRegButtons";
import {
    changeAccessContextWithAuthPayload,
    ClientAccessStateContext,
} from "@/app/context/auth/ClientAccessStateContext";
import { useRouter } from "next/navigation";
import postUserRegCredentials from "@/app/server-actions/auth/reg/user/postUserRegCredentials";
import postUserRegCode from "@/app/server-actions/auth/reg/user/postUserRegCode";
import postCodeRefresh from "@/app/server-actions/auth/reg/user/postCodeRefresh";
import { Link } from "react-transition-progress/next";

export type UserRegCredentials = {
    first_name: string;
    invite_code: string;
    email: string;
    password: string;
    password_confirm: string;
    code: string;
};

export type UserRegPageStages = "cred-name" | "code";

const initialCredentials: UserRegCredentials = {
    first_name: "",
    invite_code: "",
    email: "",
    password: "",
    password_confirm: "",
    code: "",
};

export default function UserRegMain() {
    const [stage, setStage] = useState<UserRegPageStages>("cred-name");
    const [res, setRes] = useState<ApiResponse<
        | loginCredentialsResponsePayload
        | loginCodeResponsePayload
        | finalAuthResponsePayload
    > | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    const [isPending, setIsPending] = useState(false);

    const [credentials, setCredentials] =
        useState<UserRegCredentials>(initialCredentials);

    const accessState = use(ClientAccessStateContext);
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        setIsValid(formRef.current?.checkValidity() ?? false);
        /*       setIsValid(true); */
    }, [credentials, stage]);

    async function handlePostCredentials() {
        setIsPending(true);
        const response = await postUserRegCredentials(credentials);
        if (response.code === 200) {
            setError(null);
            setRes(response);
            setStage("code");
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
        const response = await postUserRegCode({
            token: res?.data[0]?.token,
            code: credentials.code,
        });
        if (response.code === 200 && response.data[0]) {
            setError(null);
            await setAccessStateCookies(response.data[0]);
            changeAccessContextWithAuthPayload(
                response.data[0],
                accessState.setter,
            );
            router.replace(`/my/welcome/user`);
        } else {
            setIsPending(false);
            setError(response.error_code);
        }
    }

    return (
        <div className={styles.reg_page}>
            <form
                className={styles.reg_form}
                ref={formRef}
            >
                <div className={styles.main_div}>
                    <div className={styles.header}>Регистрация</div>
                    <div className={styles.stage}>для сотрудников</div>
                    <div className={styles.content}>
                        <UserRegBody
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
                        <UserRegButtons
                            stage={stage}
                            setStage={setStage}
                            isPending={isPending}
                            isValid={isValid}
                            handlePostCredentials={handlePostCredentials}
                            handlePostCodeRefresh={handlePostCodeRefresh}
                            handlePostCode={handlePostCode}
                        />
                    </div>
                    {stage === "cred-name" && (
                        <div className={styles.note}>
                            {`Продолжая, вы соглашаетесь с `}
                            <Link href={"/pub/legal#terms"}>
                                Пользовательским соглашением
                            </Link>
                            {` и даете свое согласие на обработку персональных данных в соответствии с `}
                            <Link href={"/pub/legal#personal"}>Политикой</Link>.
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

function ErrorText({ error }: { error: string | null }) {
    if (!error) return "";

    const InnerText = () => {
        switch (error) {
            case "AUTH-REG-EMAIL-EXISTS":
                return "Пользователь с таким email уже существует.";
            case "AUTH-CODE-INVALID":
                return "Неверный код.";
            case "AUTH-CODE-LIMIT":
                return "Превышен лимит попыток. Попробуйте через сутки.";
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
