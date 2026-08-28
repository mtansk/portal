import { Button } from "@/app/components/buttons/Buttons";
import styles from "./css/header.module.scss";

export default function defaultSheetsHeader({
    onAddSheetClick,
}: {
    onAddSheetClick: () => void;
}) {
    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Шаблоны смен</div>
                <div className={styles.add}>
                    <Button
                        innerContent="Добавить шаблон"
                        type="nav"
                        colors="nav-blue"
                        onClick={onAddSheetClick}
                    />
                </div>
            </div>
        </div>
    );
}
