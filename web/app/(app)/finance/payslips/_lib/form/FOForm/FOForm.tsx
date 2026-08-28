import styles from "./fo-form.module.scss";
import { useFormHandler } from "@/app/components/hooks/useFormHandler";
import { FONames } from "@/app/types/finance/other/FinanceTypes";
import { useMemo } from "react";
import {
    PayslipFO,
    PayslipFOConstructorObject,
} from "@/app/classes/finance/PayslipFO";
import FormHandler from "@/app/components/form/FormHandler";
import { Formatter } from "@/app/classes/Formatter";
import { PayslipObjectsDispatch } from "../functions/payslipObjectsReducer";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import { PercentInput } from "@/app/components/inputs/defaults/percent/PercentInput";
import { QtyInput } from "@/app/components/inputs/defaults/qty/QtyInput";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";

export default function FOForm({
    initialObject,
    dispatch,

    typeOfFoObject,

    setDialogIsOpen,
}: {
    initialObject: PayslipFOConstructorObject;
    dispatch: (o: PayslipObjectsDispatch) => void;

    typeOfFoObject: FONames;

    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const { object, setObject, actionType, isDisabled, setActionType } =
        useFormHandler(
            initialObject,
            "add",
            useMemo(() => {
                const obj = new PayslipFO(initialObject);
                obj.setterFn("name", "");
                return obj;
            }, [initialObject]),
        );

    const formTitle = () => {
        if (typeOfFoObject === "tax") return "Налог";
        if (typeOfFoObject === "socialFee") return "Взнос";
        if (typeOfFoObject === "taxDeduction") return "Налоговый вычет";
    };

    const prefix = () => {
        if (typeOfFoObject === "tax") return "tax";
        if (typeOfFoObject === "socialFee") return "social_fee";
        if (typeOfFoObject === "taxDeduction") return "tax_deduction";
        return "tax";
    };

    function handleOnChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        const name = e.target.name as keyof PayslipFO;
        const value = () => {
            if (e.target.value) {
                return e.target.value;
            }
            return "";
        };

        const copy = object.copy();
        copy.setterFn(name, value());
        setObject(copy);
    }

    return (
        <FormHandler
            actionType={actionType}
            object={object}
            setActionType={setActionType}
            view="modal"
            buttonsNotation={{
                right: [
                    {
                        text: "Выйти",
                        style: "ne",
                        onClick() {
                            setDialogIsOpen(false);
                        },
                    },
                    {
                        text: "Сохранить",
                        style: "g",
                        disabledByForm: true,
                        onClick() {
                            dispatch({
                                type: "ADD_OBJECT",
                                payload: {
                                    objectType: typeOfFoObject,
                                    object: object.createSQLObject(prefix()),
                                },
                            });
                            setDialogIsOpen(false);
                        },
                    },
                ],
            }}
            setDialogIsOpen={setDialogIsOpen}
            title={formTitle()}
        >
            <div className={styles.main_div}>
                <div className={styles.name}>
                    <NameInput
                        isDisabled={isDisabled}
                        value={object.name}
                        onChange={handleOnChange}
                    />
                </div>
                <div className={styles.params_div}>
                    <div className={styles.rate}>
                        {typeOfFoObject === "taxDeduction" ?
                            <RateInput
                                isDisabled={isDisabled}
                                onChange={handleOnChange}
                                value={object.rate}
                            />
                        :   <PercentInput
                                isDisabled={isDisabled}
                                onChange={handleOnChange}
                                value={object.rate}
                            />
                        }
                    </div>
                    <div className={styles.qty}>
                        {typeOfFoObject !== "taxDeduction" && (
                            <QtyInput
                                isDisabled={isDisabled}
                                onChange={handleOnChange}
                                value={object.qty}
                                label="База"
                            />
                        )}
                    </div>
                    <div className={styles.total}>
                        {Formatter.currencyString({
                            value:
                                typeOfFoObject === "tax" ?
                                    object.total * -1
                                :   object.total,
                            signDisplay: "negative",
                        })}
                    </div>
                </div>
                {typeOfFoObject !== "taxDeduction" && (
                    <>
                        <div className={styles.note}>
                            Пожалуйста, укажите проценты в виде десятичного
                            числа. Например, <br />
                            13% = 0,13 или 4,95% = 0,0495.
                        </div>
                        <div className={styles.round}>
                            <CustomCheckbox
                                text="Округление"
                                isDisabled={isDisabled}
                                value={object.is_round === 1}
                                onChange={(b) => {
                                    const copy = object.copy();
                                    copy.setterFn("is_round", b ? 1 : 0);
                                    setObject(copy);
                                }}
                                className={styles.checkbox}
                            />
                        </div>
                    </>
                )}
            </div>
        </FormHandler>
    );
}
