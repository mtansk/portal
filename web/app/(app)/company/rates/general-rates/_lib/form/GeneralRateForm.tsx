import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";

import styles from "./css/general-rate-form.module.scss";
import FormHandler from "@/app/components/form/FormHandler";
import { useMemo } from "react";
import { IDBGeneralRate } from "@/app/types/general-rate/GeneralRates";
import {
    ApiAccrualGroup,
    NullableAccrualGroup,
} from "@/app/types/accrual-group/AccrualGroups";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { putGeneralRate } from "@/app/server-actions/rates/general/putGeneralRate";
import { deleteGeneralRate } from "@/app/server-actions/rates/general/deleteGeneralRate";
import { postGeneralRate } from "@/app/server-actions/rates/general/postGeneralRate";
import AccrualGroupSelectorNew from "@/app/components/inputs/defaults/accrual-group/AccrualGroupSelectorNew";

export type FormGeneralRate = IDBGeneralRate;

export default function GeneralRateForm({
    initialRate,
    groups,

    type,
    view,

    setDialogIsOpen,
}: {
    initialRate: FormGeneralRate;
    groups: ApiAccrualGroup[];

    type: FormTypes;
    view: "page" | "modal";

    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const {
        object: rate,
        setObject,
        actionType,
        isDisabled,
        setActionType,
    } = useFormHandler(initialRate, type);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        setObject({ ...rate, [e.target.name]: e.target.value });
    }

    const groupsWithNoGroup = useMemo((): NullableAccrualGroup[] => {
        return ([...groups] as NullableAccrualGroup[]).concat({
            accrual_group_id: null,
            accrual_group_name: "Без группы",
        });
    }, [groups]);

    return (
        <FormHandler
            object={rate}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            setDialogIsOpen={setDialogIsOpen}
            title="Ставка для начислений"
            actions={{
                putAction: async () => putGeneralRate(rate),
                postAction: async () => postGeneralRate(rate),
                deleteAction: async () => deleteGeneralRate(rate),
            }}
        >
            <div className={styles.main_div}>
                <div className={styles.group}>
                    <AccrualGroupSelectorNew
                        groups={groupsWithNoGroup}
                        isDisabled={isDisabled}
                        selectedId={rate.accrual_group_id}
                        onChange={(group) =>
                            setObject({
                                ...rate,
                                accrual_group_id: group.accrual_group_id,
                            })
                        }
                        headerLike={false}
                    />
                </div>
                <div className={styles.name}>
                    <NameInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="general_rate_name"
                        value={rate.general_rate_name}
                    />
                </div>
                <div className={styles.rate}>
                    <RateInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="general_rate_rate"
                        value={rate.general_rate_rate}
                        required={true}
                    />
                    <CustomCheckbox
                        isDisabled={isDisabled}
                        text="Видна всем сотрудникам"
                        value={rate.general_rate_is_public === 1}
                        onChange={(value) =>
                            setObject({
                                ...rate,
                                general_rate_is_public: value ? 1 : 0,
                            })
                        }
                    />
                </div>
                <div className={styles.desc}>
                    <DescInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="general_rate_desc"
                        value={rate.general_rate_desc}
                    />
                </div>
            </div>
        </FormHandler>
    );
}
