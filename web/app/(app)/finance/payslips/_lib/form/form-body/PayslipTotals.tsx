import { Formatter } from "@/app/classes/Formatter";
import totalsStyles from "./css/totals.module.scss";

const Row = ({
    title,
    total,
    additionalStyles = "",
}: {
    title: string;
    total: string;
    additionalStyles?: string;
}) => (
    <>
        <div className={`${totalsStyles.row_title} ${additionalStyles}`}>
            {title}
        </div>
        <div className={`${totalsStyles.row_total} ${additionalStyles}`}>
            {total}
        </div>
    </>
);

const PayslipTotals = ({
    accrualsTotal,
    taxesTotal,
    reductionsTotal,
    paymentsTotal,
}: {
    accrualsTotal: number;
    taxesTotal: number;
    reductionsTotal: number;
    paymentsTotal: number;
}) => {
    const totalToPay = accrualsTotal - taxesTotal - reductionsTotal;
    const remainingToPay = totalToPay - paymentsTotal;

    return (
        <div className={totalsStyles.totals}>
            <div className={totalsStyles.title}>Итоги</div>
            <div className={totalsStyles.totals_grid}>
                <Row
                    title="Всего начислено:"
                    total={Formatter.currencyString({
                        value: accrualsTotal,
                        signDisplay: "never",
                    })}
                />
                <Row
                    title="Налоги к удержанию:"
                    total={Formatter.currencyString({
                        value: taxesTotal * -1,
                        signDisplay: "never",
                        prettyMinus: true,
                    })}
                />
                <Row
                    title="Другие удержания:"
                    total={Formatter.currencyString({
                        value: reductionsTotal * -1,
                        signDisplay: "never",
                        prettyMinus: true,
                    })}
                />
                <Row
                    title="Всего к выплате:"
                    total={Formatter.currencyString({
                        value: totalToPay,
                        signDisplay: "negative",
                        prettyMinus: true,
                    })}
                    additionalStyles={totalsStyles.overall_total}
                />
                <Row
                    title="Выплачено:"
                    total={Formatter.currencyString({
                        value: paymentsTotal,
                        signDisplay: "never",
                    })}
                    additionalStyles={totalsStyles.bottom}
                />
                <Row
                    title="Остаток к выплате:"
                    total={Formatter.currencyString({
                        value: remainingToPay >= 0 ? remainingToPay : 0,
                        signDisplay: "never",
                    })}
                    additionalStyles={totalsStyles.bottom}
                />
            </div>
        </div>
    );
};

export default PayslipTotals;
