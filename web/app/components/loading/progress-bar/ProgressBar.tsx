import styles from "./bar.module.scss";
import { ProgressBar as InitialBar } from "react-transition-progress";

export default function ProgressBar() {
    return <InitialBar className={styles.bar} />;
}
