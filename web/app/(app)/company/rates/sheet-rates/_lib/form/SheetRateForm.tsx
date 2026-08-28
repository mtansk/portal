import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";

import styles from "./css/sheet-rate-form.module.scss";
import FormHandler from "@/app/components/form/FormHandler";
import { IDBSheetRate } from "@/app/types/sheet-rate/SheetRates";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import CustomRadio from "@/app/components/inputs/radio/CustomRadio";
import { MEASURE_TYPES } from "@/app/global/MEASURE_TYPES";
import { deleteSheetRate } from "@/app/server-actions/rates/sheet/deleteSheetRate";
import { postSheetRate } from "@/app/server-actions/rates/sheet/postSheetRate";
import { putSheetRate } from "@/app/server-actions/rates/sheet/putSheetRate";

export type FormSheetRate = IDBSheetRate;

export default function SheetRateForm({
    initialRate,

    type,
    view,

    setDialogIsOpen,
}: {
    initialRate: FormSheetRate;

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

    return (
        <FormHandler
            object={rate}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            setDialogIsOpen={setDialogIsOpen}
            title="Ставка для смен"
            actions={{
                putAction: async () => putSheetRate(rate),
                postAction: async () => postSheetRate(rate),
                deleteAction: async () => deleteSheetRate(rate),
            }}
        >
            <div className={styles.main_div}>
                <div className={styles.name}>
                    <NameInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="sheet_rate_name"
                        value={rate.sheet_rate_name}
                    />
                </div>
                <div className={styles.rate}>
                    <RateInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="sheet_rate_rate"
                        value={rate.sheet_rate_rate}
                        required={true}
                    />
                    <InputWrapper
                        required={true}
                        isDisabled={isDisabled}
                    >
                        <CustomRadio
                            array={MEASURE_TYPES}
                            currentSelection={MEASURE_TYPES.find(
                                (type) =>
                                    type.measure_type === rate.measure_type,
                            )}
                            getOptionText={(option) =>
                                option?.measure_name || ""
                            }
                            handleSelection={(selection) => {
                                setObject({
                                    ...rate,
                                    measure_type:
                                        selection?.measure_type || "hour",
                                });
                            }}
                            title="База оплаты"
                            isDisabled={isDisabled}
                        />
                    </InputWrapper>

                    <CustomCheckbox
                        isDisabled={isDisabled}
                        text="Видна всем сотрудникам"
                        value={rate.sheet_rate_is_public === 1}
                        onChange={(value) =>
                            setObject({
                                ...rate,
                                sheet_rate_is_public: value ? 1 : 0,
                            })
                        }
                    />
                </div>
                <div className={styles.desc}>
                    <DescInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="sheet_rate_desc"
                        value={rate.sheet_rate_desc}
                    />
                </div>
            </div>
        </FormHandler>
    );
}
