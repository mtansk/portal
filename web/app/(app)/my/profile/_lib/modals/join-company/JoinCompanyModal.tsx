import styles from "./join.module.scss";
import { useServerAction } from "@/app/components/hooks/useServerAction";
import { useState, useRef, useEffect, use } from "react";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import setAccessStateCookies from "@/app/server-actions/auth/cookies/setAccessStateCookies";
import { useRouter } from "next/navigation";
import postJoinCompany from "@/app/server-actions/my/company/postJoinCompany";
import {
    changeAccessContextWithAuthPayload,
    ClientAccessStateContext,
} from "@/app/context/auth/ClientAccessStateContext";
import { Button } from "@/app/components/buttons/Buttons";

export type FormJoinCompany = {
    first_name: string;
    invite_code: string;
};

export default function JoinCompanyModal({
    setDialogIsOpen,
}: {
    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const [payload, setPayload] = useState<FormJoinCompany>({
        first_name: "",
        invite_code: "",
    });

    const [isPending, setIsPending] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const accessState = use(ClientAccessStateContext);

    const serverAction = useServerAction();
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(
        () => setIsValid(formRef.current?.checkValidity() ?? false),
        [payload],
    );

    async function handleSaveClick() {
        setIsPending(true);
        const res = await serverAction({
            serverAction: () => postJoinCompany(payload),
            showSuccess: true,
        });
        if (res.ok) {
            await setAccessStateCookies(res.data[0]);
            changeAccessContextWithAuthPayload(res.data[0], accessState.setter);
            setDialogIsOpen(false);
        }
        setIsPending(false);
    }

    return (
        <form ref={formRef}>
            <div className={styles.main_div}>
                <div className={styles.header}>Присоединиться к компании</div>
                <InputWrapper
                    label="Ваше имя"
                    isDisabled={false}
                    className={styles.name}
                >
                    <input
                        type="text"
                        value={payload.first_name}
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                first_name: e.target.value,
                            })
                        }
                        required={true}
                        id="first_name"
                        maxLength={30}
                        className={styles.input}
                    />
                </InputWrapper>
                <div className={styles.note}>
                    {`Имя должно быть указано точно так же, как и в новой компании.`}
                </div>
                <InputWrapper
                    label="Секретный код"
                    isDisabled={false}
                    lengthOptions={{
                        current: payload.invite_code.length,
                        max: 5,
                    }}
                    id="invite_code"
                    className={styles.code}
                >
                    <input
                        type="text"
                        value={payload.invite_code}
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                invite_code: e.target.value,
                            })
                        }
                        required={true}
                        maxLength={5}
                        id="invite_code"
                        className={styles.input}
                    />
                </InputWrapper>

                <div className={styles.button_div}>
                    <Button
                        type="filled"
                        colors="submit-gray"
                        innerContent="Далее"
                        onClick={async () => {
                            await handleSaveClick();
                        }}
                        isDisabled={!isValid || isPending}
                        isPending={isPending}
                    />
                </div>
            </div>
        </form>
    );
}
