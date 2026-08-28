import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";
import styles from "./css/header.module.scss";
import { PayslipsSearchParams } from "../../page";
import useParamsChanger from "../../../../../components/hooks/useParamsChanger";
import { Button } from "@/app/components/buttons/Buttons";

export default function PayslipsHeader({
    searchParams,

    handleAddManualClick,
    handleAddAutoClick,
}: {
    searchParams: PayslipsSearchParams;

    handleAddManualClick: () => void;
    handleAddAutoClick: () => void;
}) {
    const changer = useParamsChanger();

    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Расчетные листы</div>
                <div className={styles.add}>
                    <Button
                        type="nav"
                        colors="nav-blue"
                        innerContent="Создать лист"
                        onClick={handleAddManualClick}
                    />
                    <div className={styles.stripe}></div>
                    <Button
                        type="nav"
                        colors="nav-purple"
                        innerContent="Автоматическое создание"
                        onClick={handleAddAutoClick}
                    />
                </div>
                <div className={styles.period}>
                    <PeriodPicker
                        allowedPeriods={new Set(["month", "week", "custom"])}
                        defaultPeriod="month"
                        initialParams={searchParams}
                        shouldUseURL={true}
                        key={searchParams.start + searchParams.end}
                    />
                </div>
                {searchParams.uid && (
                    <div className={styles.filter}>
                        Включен фильтр по сотруднику.
                        <button
                            type="button"
                            className={styles.filter_button}
                            onClick={() => changer("uid", "")}
                        >
                            Сбросить
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
