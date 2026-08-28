import styles from "./css/header.module.scss";
import RatesNav from "../../../_lib/RatesNav";
import { Button } from "@/app/components/buttons/Buttons";

export default function generalRatesHeader({
    onAddRateClick,
}: {
    onAddRateClick: () => void;
}) {
    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Ставки и группы</div>
                <div className={styles.nav}>
                    <RatesNav />
                </div>
                <div className={styles.add}>
                    <Button
                        innerContent="Добавить ставку"
                        type="nav"
                        colors="nav-blue"
                        onClick={onAddRateClick}
                    />
                </div>
            </div>
        </div>
    );
}
