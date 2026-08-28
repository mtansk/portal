import Spinner from "@/app/components/loading/spinner/Spinner";
import { useState, useRef, useEffect } from "react";
import styles from "./css/buttons.module.scss";
import { LoginPageStages } from "./LoginMain";
import { Link } from "react-transition-progress/next";
import { Button } from "@/app/components/buttons/Buttons";

export default function LoginButtons({
    stage,

    isPending,
    isValid,

    handlePostCredentials,
    handlePostCodeRefresh,
    handlePostCode,
    handleCompanySelection,
}: {
    stage: LoginPageStages;

    isPending: boolean;
    isValid: boolean;

    handlePostCredentials: () => Promise<void>;
    handlePostCodeRefresh: () => Promise<void>;
    handlePostCode: () => Promise<void>;
    handleCompanySelection: () => Promise<void>;
}) {
    if (stage === "code") {
        return (
            <>
                <CodeRefreshButton
                    handlePostCodeRefresh={handlePostCodeRefresh}
                />
                <Button
                    type="filled"
                    colors="submit-gray"
                    onClick={async () => {
                        await handlePostCode();
                    }}
                    innerContent="Далее"
                    isDisabled={!isValid}
                    isPending={isPending}
                />
            </>
        );
    }

    if (isPending) {
        return (
            <>
                <div></div> <Spinner />
            </>
        );
    }

    if (stage === "password") {
        return (
            <>
                <Link
                    href="/auth/reg/company"
                    className={styles.reg_button}
                >
                    Регистрация
                </Link>
                <Button
                    type="filled"
                    colors="submit-gray"
                    onClick={async () => {
                        await handlePostCredentials();
                    }}
                    innerContent="Далее"
                    isDisabled={!isValid}
                />
            </>
        );
    } else if (stage === "company") {
        return (
            <>
                <div></div>
                <Button
                    type="filled"
                    colors="submit-gray"
                    onClick={async () => {
                        await handleCompanySelection();
                    }}
                    innerContent="Войти"
                    isDisabled={!isValid}
                />
            </>
        );
    }
}

export function CodeRefreshButton({
    handlePostCodeRefresh,
}: {
    handlePostCodeRefresh: () => Promise<void>;
}) {
    const [timeLeft, setTimeLeft] = useState(60);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeLeft === 0) {
            return;
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timerRef.current!);
                    timerRef.current = null;
                    return 0;
                }
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timeLeft]);

    const handleClick = async () => {
        await handlePostCodeRefresh();
        setTimeLeft(60);
    };

    return (
        <button
            type="button"
            className={styles.resend_button}
            onClick={async () => handleClick()}
            disabled={timeLeft > 0}
        >
            {`Отправить код повторно${
                timeLeft ?
                    ` ${Intl.DateTimeFormat("ru", {
                        minute: "numeric",
                        second: "2-digit",
                    }).format(new Date(timeLeft * 1000))}`
                :   ""
            }`}
        </button>
    );
}
