import styles from "./create.module.scss";
import { useServerAction } from "@/app/components/hooks/useServerAction";
import { useState, useRef, useEffect, use } from "react";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import postMyCompany from "@/app/server-actions/my/company/postMyCompany";
import setAccessStateCookies from "@/app/server-actions/auth/cookies/setAccessStateCookies";
import { useRouter } from "next/navigation";
import {
    changeAccessContextWithAuthPayload,
    ClientAccessStateContext,
} from "@/app/context/auth/ClientAccessStateContext";
import { Button } from "@/app/components/buttons/Buttons";

export type FormCompany = {
    companyName: string;
    useTemplate: 1 | 0;
};

export default function CreateCompanyModal({
    setDialogIsOpen,
}: {
    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const [company, setCompany] = useState<FormCompany>({
        companyName: "",
        useTemplate: 1,
    });

    const [isPending, setIsPending] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const accessState = use(ClientAccessStateContext);

    const serverAction = useServerAction();
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(
        () => setIsValid(formRef.current?.checkValidity() ?? false),
        [company],
    );

    async function handleSaveClick() {
        setIsPending(true);
        const res = await serverAction({
            serverAction: () => postMyCompany(company),
            showSuccess: true,
        });
        if (res.ok) {
            await setAccessStateCookies(res.data[0]);
            changeAccessContextWithAuthPayload(res.data[0], accessState.setter);
            router.replace(`/my/welcome/company?learn=${company.useTemplate}`);
            setDialogIsOpen(false);
        }
        setIsPending(false);
    }

    return (
        <form ref={formRef}>
            <div className={styles.main_div}>
                <div className={styles.header}>Создание компании</div>
                <InputWrapper
                    label="Название компании"
                    isDisabled={false}
                    lengthOptions={{
                        current: company.companyName.length,
                        max: 100,
                    }}
                    className={styles.name}
                >
                    <textarea
                        className={styles.textarea}
                        value={company.companyName}
                        onChange={(e) =>
                            setCompany({
                                ...company,
                                companyName: e.target.value,
                            })
                        }
                        required={true}
                        maxLength={100}
                    />
                </InputWrapper>
                <CustomCheckbox
                    value={company?.useTemplate === 1}
                    onChange={(b) => {
                        setCompany({ ...company, useTemplate: b ? 1 : 0 });
                    }}
                    text="Режим ознакомления"
                    isDisabled={false}
                    className={styles.checkbox}
                />
                <div className={styles.note}>
                    {`При включении этого режима в вашу компанию добавятся
                    несколько тестовых сотрудников с данными, чтобы вы могли
                    сразу попробовать все возможности Портала. Вы сможете
                    удалить их в любой момент.`}
                </div>
                <div className={styles.button_div}>
                    <Button
                        type="filled"
                        colors="submit-gray"
                        innerContent="Создать"
                        isDisabled={!isValid || isPending}
                        isPending={isPending}
                        onClick={async () => {
                            await handleSaveClick();
                        }}
                    />
                </div>
            </div>
        </form>
    );
}
