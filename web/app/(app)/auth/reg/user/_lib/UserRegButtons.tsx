import Spinner from "@/app/components/loading/spinner/Spinner";
import styles from "./css/buttons.module.scss";
import { UserRegPageStages } from "./UserRegMain";
import { Link } from "react-transition-progress/next";
import { CodeRefreshButton } from "../../../login/_lib/LoginButtons";
import { Button } from "@/app/components/buttons/Buttons";

export default function UserRegButtons({
    stage,
    setStage,

    isPending,
    isValid,

    handlePostCredentials,
    handlePostCodeRefresh,
    handlePostCode,
}: {
    stage: UserRegPageStages;
    setStage: (value: UserRegPageStages) => void;

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
                <Button
                    type="filled"
                    colors="submit-gray"
                    innerContent="Далее"
                    onClick={async () => {
                        await handlePostCode();
                    }}
                    isDisabled={!isValid}
                    isPending={isPending}
                />
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
                    href="/auth/reg/company"
                    className={styles.reg_button}
                >
                    Регистрация для компаний
                </Link>
                <Button
                    type="filled"
                    colors="submit-gray"
                    innerContent="Далее"
                    onClick={async () => {
                        await handlePostCredentials();
                    }}
                    isDisabled={!isValid}
                />
            </div>
        );
    }
}
