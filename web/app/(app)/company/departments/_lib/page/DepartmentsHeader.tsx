import { Button } from "@/app/components/buttons/Buttons";
import styles from "./css/header.module.scss";

export default function DepartmentsHeader({
    onAddClick,
}: {
    onAddClick: () => void;
}) {
    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Отделы</div>
                <div className={styles.add}>
                    <Button
                        type="filled"
                        colors="nav-blue"
                        onClick={onAddClick}
                        innerContent="Добавить отдел"
                    />
                </div>
            </div>
        </div>
    );
}
