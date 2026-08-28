import Spinner from "../spinner/Spinner";
import styles from "./calendar-loading.module.scss";

export default function CalendarLoadingNew() {
    return (
        <div className={styles.loading_div}>
            {/*  <div className={`${styles.header_div} ${styles.loading}`}></div> */}
            <div className={`${styles.body_div}`}>
                <Spinner />
            </div>
        </div>
    );
}
