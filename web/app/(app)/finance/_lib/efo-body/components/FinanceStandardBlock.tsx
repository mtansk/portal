import styles from "./css/block.module.scss";
import { getFinanceObjectType } from "../../functions";
import { FinanceCurrencyStringNew } from "../../other/FinanceCurrencyString";
import { FODetails } from "../../other/FODetails";
import foGroupString from "../../other/FoGroupString";
import { AllEFOObjects } from "@/app/types/finance/other/FinanceTypes";

export default function FinanceStandardBlock({
    object,
    onObjectClick,
    grouped = false,
}: {
    object: AllEFOObjects;
    onObjectClick: (object: AllEFOObjects) => void;
    grouped?: boolean;
}) {
    const objectType = getFinanceObjectType(object);

    return (
        <div
            className={`${styles.object_div} ${styles[objectType || ""]} ${object.payslip_id ? styles.archive : ""} ${
                grouped ? styles.grouped : ""
            }`}
            key={object.id}
            onClick={() => onObjectClick(object)}
            title={`${
                object.payslip_id ?
                    "Архивировано. Уже находится в Расчетном Листе."
                :   ""
            }`}
        >
            {!grouped && (
                <div className={styles.user_div}>
                    <div
                        className={styles.user_name}
                        title={object?.user_title || ""}
                    >
                        {(object?.last_name || "") + " " + object?.first_name}
                    </div>
                </div>
            )}
            <div className={styles.group}>{foGroupString(object)}</div>
            <div className={styles.object_name}>{object.name}</div>
            <div className={styles.date}>{object.formattedDate}</div>
            <div className={styles.details}>
                <FODetails object={object} />
            </div>
            <div className={`${styles.total} ${objectType}`}>
                <div
                    className={
                        parseFloat(object.total) > 0 ?
                            `colored ${objectType}`
                        :   ""
                    }
                >
                    <FinanceCurrencyStringNew
                        total={object.total}
                        archive={object.payslip_id !== null}
                        colored={parseFloat(object.total) > 0}
                        type={objectType}
                    />
                </div>
            </div>
        </div>
    );
}
