import { Formatter } from "@/app/classes/Formatter";
import FinanceStandardBlock from "../components/FinanceStandardBlock";
import styles from "./css/body.module.scss";
import { ArrayWithTotal } from "@/app/types/finance/other/FinanceTypes";
import { AllEFOObjects } from "@/app/types/finance/other/FinanceTypes";

export default function FinanceBodyList({
    arrayOfObjects,
    onObjectClick,
}: {
    arrayOfObjects: ArrayWithTotal<AllEFOObjects>;

    onObjectClick: (object: AllEFOObjects) => void;
}) {
    return (
        <>
            {arrayOfObjects?.array.map((object, i) => {
                if (i > 1000) throw new Error("Too many objects");

                return (
                    <FinanceStandardBlock
                        object={object}
                        onObjectClick={onObjectClick}
                        grouped={false}
                        key={object.id}
                    />
                );
            })}
            <div className={styles.page_total}>
                <div className={styles.name}>
                    Всего <span>по отображенным</span>:
                </div>
                <div className={styles.total}>
                    {Formatter.currencyString({ value: arrayOfObjects?.total })}
                </div>
            </div>
        </>
    );
}
