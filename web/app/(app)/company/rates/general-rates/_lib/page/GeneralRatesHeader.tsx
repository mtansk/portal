import styles from "./css/header.module.scss";
import RatesNav from "../../../_lib/RatesNav";
import { Button } from "@/app/components/buttons/Buttons";

export default function generalRatesHeader({
    onAddRateClick,
    onAddGroupClick,
}: {
    onAddRateClick: () => void;
    onAddGroupClick: () => void;
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
                    <div className={styles.stripe}></div>
                    <Button
                        innerContent="Добавить группу"
                        type="nav"
                        colors="nav-purple"
                        onClick={onAddGroupClick}
                    />
                </div>
            </div>
        </div>
    );
}
