import { ApiMyAccrual } from "@/app/types/finance/accrual/Accruals";
import { ApiMyPayment } from "@/app/types/finance/payments/Payments";
import { ApiMyReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiMySheet } from "@/app/types/sheet/Sheets";
import { MyFinanceSearchParams } from "../../page";

import styles from "./css/body.module.scss";
import { memo, useState } from "react";
import { EFOApiFields, EFONames } from "@/app/types/finance/other/FinanceTypes";
import { foNameString } from "@/app/(app)/finance/payslips/_lib/form/form-body/PayslipObjectsContainer";
import { calculateFOArrayTotal } from "@/app/(app)/finance/_lib/functions";
import foGroupString from "@/app/(app)/finance/_lib/other/FoGroupString";
import { FODetails } from "@/app/(app)/finance/_lib/other/FODetails";
import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import { dateStringToUTCDate } from "@/app/functions/dates";

const MyFinanceBody = memo(function MyFinanceBody({
    searchParams,

    accruals,
    sheets,
    reductions,
    payments,

    handleObjectClick,
}: {
    searchParams: MyFinanceSearchParams;

    accruals: ApiMyAccrual[];
    sheets: ApiMySheet[];
    reductions: ApiMyReduction[];
    payments: ApiMyPayment[];

    handleObjectClick: (id: string) => void;
}) {
    return (
        <>
            <div className={styles.body}>
                <div className={styles.main_body_div}>
                    <ObjectGroup
                        arrayOfObjects={[...accruals, ...sheets]}
                        typeOfObject={"accrual"}
                        handleObjectClick={(id) => {
                            handleObjectClick(id);
                        }}
                    />
                    <ObjectGroup
                        arrayOfObjects={reductions}
                        typeOfObject={"reduction"}
                        handleObjectClick={(id) => {
                            handleObjectClick(id);
                        }}
                    />
                    <ObjectGroup
                        arrayOfObjects={payments}
                        typeOfObject={"payment"}
                        handleObjectClick={(id) => {
                            handleObjectClick(id);
                        }}
                    />
                </div>
            </div>
        </>
    );
});

export default MyFinanceBody;

function ObjectGroup({
    arrayOfObjects,
    typeOfObject,

    handleObjectClick,
}: {
    arrayOfObjects: EFOApiFields[];
    typeOfObject: EFONames;

    handleObjectClick?: (id: string) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const total = calculateFOArrayTotal(arrayOfObjects);
    const dates = new Set(
        arrayOfObjects
            .map((item) => item.date)
            .sort((a, b) => {
                return (
                    dateStringToUTCDate(a).getTime() -
                    dateStringToUTCDate(b).getTime()
                );
            }),
    );

    return (
        <div className={styles.group_div}>
            <div
                className={styles.main_div}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={"icon " + styles.arrow}>
                    {isExpanded ?
                        "keyboard_arrow_down"
                    :   "keyboard_arrow_right"}
                </div>
                <div className={styles.object_name}>
                    {foNameString(typeOfObject)}
                </div>
                <div className={`${styles.total}`}>
                    <FinanceCurrencyStringNew
                        total={total}
                        colored={false}
                        type={typeOfObject}
                    />
                </div>
            </div>
            {isExpanded && (
                <div className={styles.objects}>
                    {Array.from(dates).map((date) => {
                        const objects = arrayOfObjects.filter(
                            (item) => item.date === date,
                        );

                        return (
                            <div
                                className={styles.date_div}
                                key={date}
                            >
                                <div className={styles.date}>
                                    {Intl.DateTimeFormat("ru-RU", {
                                        day: "2-digit",
                                        month: "short",
                                        weekday: "short",
                                        timeZone: "UTC",
                                    }).format(dateStringToUTCDate(date))}
                                </div>
                                <div className={styles.blocks_div}>
                                    {objects.map((object) => (
                                        <Block
                                            key={object.id}
                                            object={object}
                                            typeOfObject={typeOfObject}
                                            handleObjectClick={
                                                handleObjectClick
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {isExpanded && dates.size === 0 && (
                <div className={styles.objects}>
                    <div className={styles.date_div}>
                        <div className={styles.date}>Нет данных.</div>
                    </div>
                </div>
            )}
        </div>
    );
}
function Block({
    object,
    typeOfObject,

    handleObjectClick,
}: {
    object: EFOApiFields;
    typeOfObject: EFONames;

    handleObjectClick?: (id: string) => void;
}) {
    return (
        <div
            className={styles.block_div}
            onClick={() => handleObjectClick && handleObjectClick(object.id)}
        >
            <div className={styles.block_group}>{foGroupString(object)}</div>
            <div className={styles.block_name}>{object.name}</div>
            <div className={styles.block_details}>
                <FODetails object={object} />
            </div>
            <div className={styles.block_total}>
                <FinanceCurrencyStringNew
                    total={object.total}
                    colored={true}
                    type={typeOfObject}
                    archive={object.payslip_id !== null}
                />
            </div>
        </div>
    );
}
