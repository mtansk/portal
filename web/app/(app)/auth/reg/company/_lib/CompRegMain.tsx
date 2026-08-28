"use client";

import { use, useEffect, useRef, useState } from "react";
import styles from "./css/reg.module.scss";
import { loginCredentialsResponsePayload } from "@/app/server-actions/auth/login/credentials/postLoginCredentials";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { loginCodeResponsePayload } from "@/app/server-actions/auth/login/code/postLoginCode";
import { finalAuthResponsePayload } from "@/app/server-actions/auth/login/company-selection/postCompanySelection";
import {
    changeAccessContextWithAuthPayload,
    ClientAccessStateContext,
} from "@/app/context/auth/ClientAccessStateContext";
import { useRouter } from "next/navigation";
import CompRegBody from "./CompRegBody";
import CompRegButtons from "./CompRegButtons";
import postCompRegCredentials from "@/app/server-actions/auth/reg/company/credentials/postCompRegCredentials";
import postCompanyRegCode from "@/app/server-actions/auth/reg/company/code/postCompRegCode";
import setAccessStateCookies from "@/app/server-actions/auth/cookies/setAccessStateCookies";
import postCodeRefresh from "@/app/server-actions/auth/reg/user/postCodeRefresh";
import { Link } from "react-transition-progress/next";

export type CompRegCredentials = {
    first_name: string;
    company_name: string;
    email: string;
    password: string;
    password_confirm: string;
    use_template: 0 | 1;
    code: string;
};

export type CompRegPageStages =
    | "cred-name"
    | "cred-company"
    | "cred-checkbox"
    | "cred-cred"
    | "code";

const initialCredentials: CompRegCredentials = {
    first_name: "",
    company_name: "",
    email: "",
    password: "",
    password_confirm: "",
    use_template: 1,
    code: "",
};

declare const ym: (id: number, event: string, params?: any) => void;

export default function CompRegMain() {
    const [stage, setStage] = useState<CompRegPageStages>("cred-name");
    const [res, setRes] = useState<ApiResponse<
        | loginCredentialsResponsePayload
        | loginCodeResponsePayload
        | finalAuthResponsePayload
    > | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    const [isPending, setIsPending] = useState(false);

    const [credentials, setCredentials] =
        useState<CompRegCredentials>(initialCredentials);

    const accessState = use(ClientAccessStateContext);
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        setIsValid(formRef.current?.checkValidity() ?? false);
    }, [credentials, stage]);

    async function handlePostCredentials() {
        setIsPending(true);
        if ("ym" in window && ym) {
            ym(100486848, "reachGoal", "regClick");
        }
        const response = await postCompRegCredentials(credentials);
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
        const response = await postCompanyRegCode({
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
            router.replace(
                `/my/welcome/company?learn=${credentials.use_template}`,
            );
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
                    <div className={styles.header_div}>
                        <div className={styles.header}>
                            {stage === "cred-company" ?
                                <>
                                    Привет, <br /> {credentials.first_name}!
                                </>
                            :   `Регистрация`}
                        </div>
                        <div className={styles.stage}>
                            <Nav stage={stage} />
                        </div>
                    </div>

                    <div className={styles.content}>
                        <CompRegBody
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
                        <CompRegButtons
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

function Nav({ stage }: { stage: CompRegPageStages }) {
    if (stage === "cred-name") {
        return "Займет меньше минуты";
    }

    if (stage === "code") {
        return "Подтверждение почты";
    }

    if (stage === "cred-checkbox") {
        return "Шаг 2 из 3";
    }

    if (stage === "cred-cred") {
        return "Шаг 3 из 3";
    }
}
