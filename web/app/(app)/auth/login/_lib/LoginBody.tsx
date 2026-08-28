import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { loginCodeResponsePayload } from "@/app/server-actions/auth/login/code/postLoginCode";
import { loginCredentialsResponsePayload } from "@/app/server-actions/auth/login/credentials/postLoginCredentials";
import { ApiResponse } from "@/app/server-actions/functions/types";
import styles from "./css/body.module.scss";
import { LoginCredentials, LoginPageStages } from "./LoginMain";
import { finalAuthResponsePayload } from "@/app/server-actions/auth/login/company-selection/postCompanySelection";
import { Link } from "react-transition-progress/next";
import {
    AuthEmailInput,
    AuthPasswordInput,
} from "../../_lib/inputs/AuthInputs";

export default function LoginBody({
    credentials,
    setCredentials,
    res,
    stage,
}: {
    stage: LoginPageStages;
    credentials: LoginCredentials;
    setCredentials: (value: LoginCredentials) => void;
    res: ApiResponse<
        | loginCredentialsResponsePayload
        | loginCodeResponsePayload
        | finalAuthResponsePayload
    > | null;
}) {
    if (stage === "password") {
        return (
            <div className={styles.password_div}>
                <AuthEmailInput
                    value={credentials?.username}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            username: e.target.value,
                        });
                    }}
                />
                <AuthPasswordInput
                    value={credentials?.password}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            password: e.target.value,
                        });
                    }}
                    className={styles.password_wrapper}
                />
                <Link
                    className={styles.restore_button}
                    href={"/auth/restore"}
                >
                    Забыли пароль?
                </Link>
            </div>
        );
    } else if (stage === "code") {
        return (
            <div className={styles.code_div}>
                <div className={styles.text}>
                    {`Введите код, отправленный на ваш email.`}
                </div>
                <InputWrapper
                    label="Код"
                    isDisabled={false}
                    id="one-time-code"
                    lengthOptions={{
                        max: 6,
                        current: credentials?.code.length,
                    }}
                >
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={credentials?.code}
                        onChange={(e) => {
                            setCredentials({
                                ...credentials,
                                code: e.target.value,
                            });
                        }}
                        placeholder="000 000"
                        required
                        id="one-time-code"
                        className={styles.code + " " + styles.input}
                        autoComplete="off"
                        maxLength={6}
                        minLength={6}
                        name="one-time-code"
                    />
                    <input
                        type="password"
                        style={{ display: "none" }}
                        autoComplete="new-password"
                    />
                </InputWrapper>
            </div>
        );
    } else if (
        stage === "company" &&
        res?.data[0] &&
        "companies" in res?.data[0]
    ) {
        return (
            <div className={styles.company_div}>
                <div className={styles.text}>Выберите компанию</div>
                <div className={styles.companies}>
                    {res?.data[0]?.companies.map((company) => {
                        return (
                            <button
                                key={company.user_id}
                                className={styles.company_button}
                                type="button"
                                onClick={() => {
                                    setCredentials({
                                        ...credentials,
                                        user_id: company.user_id,
                                    });
                                }}
                            >
                                <div className={styles.company_name}>
                                    {company.company_name}
                                </div>
                                <div className={styles.user_title}>
                                    {company.user_title}
                                </div>
                                <div className={styles.checkbox_div}>
                                    <input
                                        type="radio"
                                        name="company"
                                        value={company.company_id}
                                        checked={
                                            credentials.user_id ===
                                            company.user_id
                                        }
                                        onChange={(e) => {
                                            setCredentials({
                                                ...credentials,
                                                user_id: company.user_id,
                                            });
                                        }}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }
}
