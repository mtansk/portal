import { ApiUser } from "@/app/types/user/Users";

import { useState } from "react";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import { SettingsType } from "../page/PayslipsMain";

import styles from "./css/auto.module.scss";
import CustomDateInput from "@/app/components/inputs/date/CustomDateInput";
import postAutoPayslips from "@/app/server-actions/finance/payslips/postAutoPayslips";
import { FormButtons } from "@/app/components/form/buttons/FormButtons";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import PeriodCalendarWithDates from "./PeriodCalendarWithDates";
import { MultipleUserInputNew } from "@/app/components/inputs/defaults/user-multiple-new/MultipleUserInputNew";
import { ApiDept } from "@/app/types/depts/Depts";
import { useServerAction } from "@/app/components/hooks/useServerAction";

export type PayslipSettingsApi = {
    user_ids: string[];
    st_date: string;
    en_date: string;
    date: string;
};

function createPayslipSettingsObject(settings: SettingsType) {
    return {
        user_ids: settings.user_ids,
        st_date: settings.period[0],
        en_date: settings.period[1],
        date: settings.date || "",
    };
}

export default function PayslipAddManualModal({
    users,
    depts,
    settings,
    setSettings,

    setDialogIsOpen,
}: {
    users: ApiUser[];
    depts: ApiDept[];
    settings: SettingsType;
    setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;

    setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [isPending, setIsPending] = useState<boolean>(false);

    const serverAction = useServerAction();

    const isValid =
        settings.user_ids.length > 0 && settings.period.length === 2 ?
            true
        :   false;

    async function handleSaveClick() {
        setIsPending(true);

        const res = await serverAction({
            serverAction: async () =>
                await postAutoPayslips(createPayslipSettingsObject(settings)),
            showSuccess: true,
        });

        if (res?.ok) {
            setDialogIsOpen(false);
        }
        setIsPending(false);
    }

    return (
        <div className={styles.main_div}>
            <form>
                <div className={styles.left_div}>
                    <div className={styles.user}>
                        <MultipleUserInputNew
                            depts={depts}
                            users={users}
                            isDisabled={false}
                            selectedUsers={settings.user_ids}
                            onSaveClick={(users) =>
                                setSettings((prevS) => {
                                    return {
                                        ...prevS,
                                        user_ids: users,
                                    };
                                })
                            }
                            className={styles.users_list}
                        />
                    </div>
                    <div className={styles.checkbox}>
                        <CustomCheckbox
                            onChange={(bool) =>
                                setSettings({ ...settings, auto: bool })
                            }
                            value={true}
                            isDisabled={true}
                            text="Заполнить автоматически"
                        />
                        <div className={styles.text}>
                            В этом режиме расчетные листы будут созданы
                            автоматически: в них добавятся все активные
                            начисления, удержания и выплаты за указанный период.
                            Отредактировать или дополнить их вы сможете уже
                            после создания.
                        </div>
                        <div className={styles.text}>
                            Период отражает срок, за который производится
                            выплата. Дата - день, в который производится
                            основная выплата.
                        </div>
                    </div>
                </div>
                <div className={styles.right_div}>
                    <div className={styles.date}>
                        <InputWrapper
                            isDisabled={false}
                            headerLike={true}
                            label="Дата"
                            required={true}
                        >
                            <CustomDateInput
                                initialDate={settings.date}
                                isDisabled={false}
                                onDateChange={(date) =>
                                    setSettings((prevS) => {
                                        return {
                                            ...prevS,
                                            date: date,
                                        };
                                    })
                                }
                            />
                        </InputWrapper>
                    </div>
                    <div className={styles.period}>
                        <InputWrapper
                            isDisabled={false}
                            required={true}
                            label="Период"
                            headerLike={true}
                        >
                            <PeriodCalendarWithDates
                                dates={settings.period}
                                onChange={(dates) => {
                                    setSettings((prevS) => {
                                        return {
                                            ...prevS,
                                            period: dates,
                                        };
                                    });
                                }}
                                onResetClick={() =>
                                    setSettings({ ...settings, period: [] })
                                }
                                maxPeriodDays={45}
                            />
                        </InputWrapper>
                    </div>
                </div>
                <div className={styles.button}>
                    <FormButtons
                        isPending={isPending}
                        isValid={isValid}
                        notation={{
                            right: [
                                {
                                    style: "g",
                                    text: "Создать",
                                    onClick: handleSaveClick,
                                    disabledByForm: true,
                                },
                            ],
                        }}
                    />
                </div>
            </form>
        </div>
    );
}
