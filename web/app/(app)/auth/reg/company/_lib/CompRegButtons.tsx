import Spinner from "@/app/components/loading/spinner/Spinner";
import styles from "./css/buttons.module.scss";
import { CompRegPageStages } from "./CompRegMain";
import { Link } from "react-transition-progress/next";
import { CodeRefreshButton } from "../../../login/_lib/LoginButtons";
import { Button } from "@/app/components/buttons/Buttons";

export default function CompRegButtons({
    stage,
    setStage,

    isPending,
    isValid,

    handlePostCredentials,
    handlePostCodeRefresh,
    handlePostCode,
}: {
    stage: CompRegPageStages;
    setStage: (value: CompRegPageStages) => void;

    isPending: boolean;
    isValid: boolean;

    handlePostCredentials: () => Promise<void>;
    handlePostCodeRefresh: () => Promise<void>;
    handlePostCode: () => Promise<void>;
}) {
    if (stage === "code") {
        return (
            <div className={styles.buttons_div}>
                <CodeRefreshButton
                    handlePostCodeRefresh={handlePostCodeRefresh}
                />
                {isPending ?
                    <Spinner />
                :   <Button
                        type="filled"
                        colors="submit-gray"
                        innerContent="Далее"
                        onClick={async () => await handlePostCode()}
                    />
                }
            </div>
        );
    }

    if (isPending) {
        return (
            <div className={styles.buttons_div}>
                <div></div> <Spinner />
            </div>
        );
    }

    if (stage === "cred-name") {
        return (
            <div className={styles.buttons_div}>
                <Link
                    href="/auth/reg/user"
                    className={styles.reg_button}
                >
                    Для сотрудников
                </Link>
                <Button
                    type="filled"
                    colors="submit-gray"
                    innerContent="Продолжить"
                    isDisabled={!isValid}
                    onClick={() => setStage("cred-company")}
                />
            </div>
        );
    }

    if (stage === "cred-company") {
        return (
            <div className={styles.buttons_div}>
                <button
                    type="button"
                    className={styles.reg_button}
                    onClick={() => {
                        setStage("cred-name");
                    }}
                >
                    Назад
                </button>
                <Button
                    type="filled"
                    colors="submit-gray"
                    innerContent="Далее"
                    isDisabled={!isValid}
                    onClick={() => setStage("cred-checkbox")}
                />
            </div>
        );
    }

    if (stage === "cred-checkbox") {
        return (
            <div className={styles.buttons_div}>
                <button
                    type="button"
                    className={styles.reg_button}
                    onClick={() => {
                        setStage("cred-company");
                    }}
                >
                    Назад
                </button>
                <Button
                    type="filled"
                    colors="submit-gray"
                    innerContent="Далее"
                    isDisabled={!isValid}
                    onClick={() => setStage("cred-cred")}
                />
            </div>
        );
    }

    if (stage === "cred-cred") {
        return (
            <div className={styles.buttons_div}>
                <button
                    type="button"
                    className={styles.reg_button}
                    onClick={() => {
                        setStage("cred-checkbox");
                    }}
                >
                    Назад
                </button>
                <Button
                    type="filled"
                    colors="submit-gray"
                    innerContent="Далее"
                    isDisabled={!isValid}
                    onClick={async () => await handlePostCredentials()}
                />
            </div>
        );
    }
}
