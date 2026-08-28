import Spinner from "@/app/components/loading/spinner/Spinner";
import styles from "./../actual-body/css/body.module.scss";

export default async function FinanceBodyLoading() {
    return (
        <div className={styles.finance_body_div}>
            <div className={`${styles.main_div} ${styles.loading}`}>
                <Spinner />
            </div>
        </div>
    );
}
