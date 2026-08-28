import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { loginCodeResponsePayload } from "@/app/server-actions/auth/login/code/postLoginCode";
import { loginCredentialsResponsePayload } from "@/app/server-actions/auth/login/credentials/postLoginCredentials";
import { ApiResponse } from "@/app/server-actions/functions/types";
import styles from "./css/cred-body.module.scss";
import { CompRegCredentials, CompRegPageStages } from "./CompRegMain";
import { finalAuthResponsePayload } from "@/app/server-actions/auth/login/company-selection/postCompanySelection";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import {
    AuthEmailInput,
    AuthNameInput,
    AuthNewPasswordInput,
    AuthRepeatPasswordInput,
    EmailCodeInput,
} from "../../../_lib/inputs/AuthInputs";

export default function CompRegBody({
    stage,

    credentials,
    setCredentials,
    res,
}: {
    stage: CompRegPageStages;

    credentials: CompRegCredentials;
    setCredentials: (value: CompRegCredentials) => void;
    res: ApiResponse<
        | loginCredentialsResponsePayload
        | loginCodeResponsePayload
        | finalAuthResponsePayload
    > | null;
}) {
    if (stage === "cred-name") {
        return (
            <div className={styles.reg_div}>
                <AuthNameInput
                    value={credentials?.first_name}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            first_name: e.target.value,
                        });
                    }}
                    className={styles.first_name_wrapper}
                />
            </div>
        );
    }

    if (stage === "cred-company") {
        return (
            <div className={styles.reg_div}>
                <InputWrapper
                    label="Название компании"
                    isDisabled={false}
                    required={false}
                    id="company-name"
                    lengthOptions={{
                        current: credentials?.company_name.length,
                        max: 100,
                    }}
                    className={styles.company_name_wrapper}
                >
                    <textarea
                        value={credentials?.company_name}
                        onChange={(e) => {
                            setCredentials({
                                ...credentials,
                                company_name: e.target.value,
                            });
                        }}
                        required
                        id="company-name"
                        className={styles.textarea + " " + styles.company_name}
                        maxLength={100}
                        placeholder="Его можно будет изменить в любой момент."
                    />
                </InputWrapper>
            </div>
        );
    }

    if (stage === "cred-checkbox") {
        return (
            <div className={styles.reg_div}>
                <div className={styles.checkbox_div}>
                    <CustomCheckbox
                        value={credentials?.use_template === 1}
                        onChange={(b) => {
                            setCredentials({
                                ...credentials,
                                use_template: b ? 1 : 0,
                            });
                        }}
                        text="Режим ознакомления"
                        isDisabled={false}
                        className={styles.checkbox}
                    />
                </div>
                <div className={styles.checkbox_note}>
                    При включении этого режима в вашу компанию добавится
                    тестовый сотрудников с данными, чтобы вы могли
                    поэкспериментировать. Вы сможете удалить его в любой момент.
                </div>
            </div>
        );
    }

    if (stage === "cred-cred") {
        return (
            <div className={styles.reg_div}>
                <AuthEmailInput
                    value={credentials?.email}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            email: e.target.value,
                        });
                    }}
                    className={styles.email_wrapper}
                />
                <div className={styles.note + " " + styles.email_note}>
                    На этот адрес будет отправлен код
                </div>
                <AuthNewPasswordInput
                    value={credentials?.password}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            password: e.target.value,
                        });
                    }}
                    className={styles.password_wrapper}
                />
                <AuthRepeatPasswordInput
                    value={credentials?.password_confirm}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            password_confirm: e.target.value,
                        });
                    }}
                    className={styles.password_repeat_wrapper}
                    password={credentials?.password}
                />
                <div className={styles.note + " " + styles.password_note}>
                    Не менее 8 символов
                </div>
            </div>
        );
    }

    if (stage === "code") {
        return (
            <div className={styles.reg_div + " " + styles.code_div}>
                <div className={styles.text}>
                    {`Код был отправлен на вашу почту.`}
                </div>
                <EmailCodeInput
                    value={credentials?.code}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            code: e.target.value,
                        });
                    }}
                />
            </div>
        );
    }
}
