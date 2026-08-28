import { ApiUser } from "@/app/types/user/Users";

import { Suspense } from "react";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import useBackURL from "@/app/components/hooks/useBackURL";
import { SettingsType } from "../page/PayslipsMain";

import styles from "./css/manual.module.scss";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import PeriodCalendarWithDates from "./PeriodCalendarWithDates";
import { SingleUserInputNew } from "@/app/components/inputs/defaults/user-single-new/SingleUserInputNew";
import { ApiDept } from "@/app/types/depts/Depts";
import { Button } from "@/app/components/buttons/Buttons";

export default function PayslipAddManualModal({
    users,
    depts,
    settings,
    setSettings,
}: {
    users: ApiUser[];
    depts: ApiDept[];
    settings: SettingsType;
    setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
}) {
    const isValid =
        settings.user_ids.length > 0 && settings.period.length === 2 ?
            true
        :   false;

    return (
        <div className={styles.main_div}>
            <form>
                <div className={styles.user}>
                    <SingleUserInputNew
                        depts={depts}
                        users={users}
                        isDisabled={false}
                        selectedUsers={settings.user_ids}
                        onSaveClick={(users: string[]) => {
                            setSettings({
                                ...settings,
                                user_ids: users,
                            });
                        }}
                    />
                </div>
                <div className={styles.checkbox}>
                    <CustomCheckbox
                        onChange={(bool) =>
                            setSettings({ ...settings, auto: bool })
                        }
                        value={settings.auto}
                        isDisabled={false}
                        text="Заполнить автоматически"
                    />
                    <div className={styles.text}>
                        <b>Рекомендуется.</b> Автоматическое заполнение добавит
                        в расчетный лист все начисления, удержания и выплаты за
                        указанный период, а вы сможете управлять ими вручную.
                    </div>
                </div>
                <div className={styles.calendar}>
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
                <div className={styles.button}>
                    <Suspense>
                        <ManualButton
                            settings={settings}
                            isValid={isValid}
                        />
                    </Suspense>
                </div>
            </form>
        </div>
    );
}

function ManualButton({
    settings,
    isValid,
}: {
    settings: SettingsType;
    isValid: boolean;
}) {
    const currentPath = useBackURL();

    function getHref() {
        return `/finance/payslips/add?uid=${settings.user_ids[0]}&startDate=${settings.period[0]}&endDate=${
            settings.period[1]
        }&auto=${settings.auto ? "true" : "false"}
		&backurl=${currentPath}
			`;
    }

    return (
        <Button
            type="filled"
            colors="submit-gray"
            innerContent="Создать"
            href={getHref()}
            isDisabled={!isValid}
        />
    );
}
