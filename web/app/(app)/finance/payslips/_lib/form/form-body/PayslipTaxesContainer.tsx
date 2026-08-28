import { PayslipShownObjects } from "../functions/other";
import { PayslipObjectsDispatch } from "../functions/payslipObjectsReducer";
import { PayslipContainer, PayslipListItemRow } from "./PayslipItemRows";

import styles from "./css/taxes.module.scss";
import { Formatter } from "@/app/classes/Formatter";
import { FOApiFields, FONames } from "@/app/types/finance/other/FinanceTypes";

export default function PayslipTaxesContainer({
    taxes,
    taxDeductions,
    socialFees,

    isDisabled,

    dispatch,
    onAddFOClick,
}: {
    taxes: PayslipShownObjects<FOApiFields>;
    taxDeductions: PayslipShownObjects<FOApiFields>;
    socialFees: PayslipShownObjects<FOApiFields>;

    isDisabled: boolean;

    dispatch: (o: PayslipObjectsDispatch) => void;
    onAddFOClick: (type: FONames) => void;
}) {
    const companyTotal = taxes.total + socialFees.total;

    function TypeBlock({
        typeOfObject,
    }: {
        typeOfObject: "tax" | "taxDeduction" | "socialFee";
    }) {
        const title = () => {
            switch (typeOfObject) {
                case "tax":
                    return "Налоги";
                case "taxDeduction":
                    return "Налоговые вычеты";
                case "socialFee":
                    return "Взносы";
            }
        };

        const buttonText = () => {
            switch (typeOfObject) {
                case "tax":
                    return "Добавить налог";
                case "taxDeduction":
                    return "Добавить вычет";
                case "socialFee":
                    return "Добавить взнос";
            }
        };

        function getObjects() {
            switch (typeOfObject) {
                case "tax":
                    return taxes;
                case "taxDeduction":
                    return taxDeductions;
                case "socialFee":
                    return socialFees;
            }
        }

        const objects = getObjects();

        const objectsSum = objects.total * (typeOfObject === "tax" ? -1 : 1);

        return (
            <div className={styles.type_block}>
                <div className={styles.block_header}>{title()}</div>
                <div className={styles.block_body}>
                    {objects.array.map((obj) => (
                        <PayslipListItemRow
                            isDisabled={isDisabled}
                            obj={obj}
                            key={`payslip-object-${obj.id}`}
                            onCrossClick={(id) => {
                                dispatch({
                                    type: "REMOVE_OBJECT",
                                    payload: {
                                        id,
                                        objectType: typeOfObject,
                                    },
                                });
                            }}
                        />
                    ))}
                </div>
                <div className={styles.block_bottom}>
                    <div className={styles.add}>
                        {!isDisabled && (
                            <button
                                className={styles.add_button}
                                onClick={() => onAddFOClick(typeOfObject)}
                                type="button"
                            >
                                {buttonText()}
                            </button>
                        )}
                    </div>
                    <div
                        className={
                            styles.block_total + " " + styles[typeOfObject]
                        }
                    >
                        {Formatter.currencyString({
                            value: objectsSum,
                            signDisplay: "negative",
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PayslipContainer title="Налоги и взносы">
            <div className={styles.body}>
                <div className={styles.list}>
                    <TypeBlock typeOfObject="taxDeduction" />
                    <TypeBlock typeOfObject="socialFee" />
                    <TypeBlock typeOfObject="tax" />
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={styles.total_div}>
                    {`Налоги и взносы: ${Formatter.currencyString({ value: companyTotal })}
                `}
                </div>
            </div>
        </PayslipContainer>
    );
}
