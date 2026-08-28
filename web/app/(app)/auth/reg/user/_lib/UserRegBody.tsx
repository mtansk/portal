import { loginCodeResponsePayload } from "@/app/server-actions/auth/login/code/postLoginCode";
import { loginCredentialsResponsePayload } from "@/app/server-actions/auth/login/credentials/postLoginCredentials";
import { ApiResponse } from "@/app/server-actions/functions/types";
import styles from "./css/cred-body.module.scss";
import { UserRegCredentials, UserRegPageStages } from "./UserRegMain";
import { finalAuthResponsePayload } from "@/app/server-actions/auth/login/company-selection/postCompanySelection";
import {
    AuthEmailInput,
    AuthNameInput,
    AuthNewPasswordInput,
    AuthNote,
    AuthRepeatPasswordInput,
    EmailCodeInput,
    InviteCodeInput,
} from "../../../_lib/inputs/AuthInputs";

export default function UserRegBody({
    stage,

    credentials,
    setCredentials,
    res,
}: {
    stage: UserRegPageStages;

    credentials: UserRegCredentials;
    setCredentials: (value: UserRegCredentials) => void;
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
                />
                <AuthNote text="В точности, как в компании" />
                <InviteCodeInput
                    value={credentials?.invite_code}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            invite_code: e.target.value,
                        });
                    }}
                />
                <AuthEmailInput
                    value={credentials?.email}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            email: e.target.value,
                        });
                    }}
                    className={styles.email}
                />
                <AuthNote text="На этот адрес будет отправлен код" />
                <AuthNewPasswordInput
                    value={credentials?.password}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            password: e.target.value,
                        });
                    }}
                />
                <AuthRepeatPasswordInput
                    value={credentials?.password_confirm}
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            password_confirm: e.target.value,
                        });
                    }}
                    password={credentials?.password}
                />
            </div>
        );
    }

    if (stage === "code") {
        return (
            <div className={styles.reg_div + " " + styles.code_div}>
                <div className={styles.text}>
                    {`Введите код, отправленный на ваш адрес электронной почты`}
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
