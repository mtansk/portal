import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";

import styles from "./css/default-sheet-form.module.scss";
import FormHandler from "@/app/components/form/FormHandler";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import FormHeader from "@/app/components/form/header/FormHeader";
import FormTimeInput from "@/app/components/inputs/time/FormTimeInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { timeFromSeconds } from "@/app/functions/dates";
import { IDBDefaultSheet } from "@/app/types/default-sheet/DefaultSheets";
import { putDefaultSheet } from "@/app/server-actions/default-sheets/putDefaultSheet";
import { postDefaultSheet } from "@/app/server-actions/default-sheets/postDefaultSheet";
import { deleteDefaultSheet } from "@/app/server-actions/default-sheets/deleteDefaultSheet";

export type FormDefaultSheet = IDBDefaultSheet;

export default function DefaultSheetForm({
    initialSheet,

    type,
    view,

    setDialogIsOpen,
}: {
    initialSheet: FormDefaultSheet;

    type: FormTypes;
    view: "page" | "modal";

    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const {
        object: sheet,
        setObject,
        actionType,
        isDisabled,
        setActionType,
    } = useFormHandler(initialSheet, type);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        setObject({ ...sheet, [e.target.name]: e.target.value });
    }

    function handleTimeInputChange(name: string, value: number | null) {
        setObject({ ...sheet, [name]: value });
    }

    const dur = getDefSheetDur(sheet);

    return (
        <FormHandler
            object={sheet}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            setDialogIsOpen={setDialogIsOpen}
            title="Шаблон смены"
            actions={{
                putAction: async () => putDefaultSheet(sheet),
                postAction: async () => postDefaultSheet(sheet),
                deleteAction: async () => deleteDefaultSheet(sheet),
            }}
        >
            <div className={styles.main_div}>
                <div className={styles.name}>
                    <NameInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="def_sheet_name"
                        value={sheet.def_sheet_name}
                    />
                </div>
                <div className={styles.desc}>
                    <DescInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="def_sheet_desc"
                        value={sheet.def_sheet_desc}
                    />
                </div>
                <div className={styles.time_div}>
                    <FormHeader
                        title="Время"
                        className={styles.time_header}
                    />

                    <div className={styles.start}>
                        <div className={styles.title3}>Начало</div>
                        <InputWrapper
                            isDisabled={isDisabled}
                            required={true}
                        >
                            <FormTimeInput
                                disabled={isDisabled}
                                required={true}
                                value={
                                    sheet.def_sheet_st !== null ?
                                        timeFromSeconds(sheet.def_sheet_st)
                                    :   ""
                                }
                                handleTimeInputChange={handleTimeInputChange}
                                name={"def_sheet_st"}
                                tabIndex={1}
                            />
                        </InputWrapper>
                    </div>
                    <div className={styles.end}>
                        <div className={styles.title3}>Окончание</div>
                        <InputWrapper
                            isDisabled={isDisabled}
                            required={true}
                        >
                            <FormTimeInput
                                disabled={isDisabled}
                                required={true}
                                value={
                                    sheet.def_sheet_en !== null ?
                                        timeFromSeconds(sheet.def_sheet_en)
                                    :   ""
                                }
                                handleTimeInputChange={handleTimeInputChange}
                                name={"def_sheet_en"}
                                tabIndex={2}
                            />
                        </InputWrapper>
                    </div>
                    <div className={styles.plus_day}>
                        <div className={styles.title3}>
                            Окончание после 00:00
                        </div>
                        <CustomCheckbox
                            isDisabled={isDisabled}
                            value={sheet.def_sheet_plus_day === 1}
                            text="Да"
                            onChange={(b) =>
                                setObject({
                                    ...sheet,
                                    def_sheet_plus_day: b ? 1 : 0,
                                })
                            }
                        />
                    </div>
                    <div className={styles.break}>
                        <div className={styles.title3}>Перерывы</div>
                        <InputWrapper
                            isDisabled={isDisabled}
                            required={true}
                        >
                            <FormTimeInput
                                disabled={isDisabled}
                                required={true}
                                value={
                                    sheet.def_sheet_break !== null ?
                                        timeFromSeconds(sheet.def_sheet_break)
                                    :   ""
                                }
                                handleTimeInputChange={handleTimeInputChange}
                                name={"def_sheet_break"}
                                tabIndex={3}
                            />
                        </InputWrapper>
                    </div>
                    <>
                        <div className={styles.total_dur}>
                            <div className={styles.title3}>Рабочее время</div>
                            <div
                                className={
                                    styles.dur_time +
                                    " " +
                                    (dur && dur < 0 ? styles.invalid : "")
                                }
                            >
                                {timeFromSeconds(dur || 0)}
                            </div>
                        </div>
                        {/*  <DummyInput
                            value={dur !== null && dur >= 0 ? "1" : ""}
                        /> */}
                    </>
                </div>
            </div>
        </FormHandler>
    );
}

function getDefSheetDur(sheet: FormDefaultSheet): number | null {
    if (
        sheet.def_sheet_st !== null &&
        sheet.def_sheet_en !== null &&
        sheet.def_sheet_break !== null
    ) {
        const dur =
            sheet.def_sheet_en -
            sheet.def_sheet_st -
            sheet.def_sheet_break +
            (sheet.def_sheet_plus_day ? 24 * 60 * 60 : 0);

        return dur;
    }

    return null;
}
