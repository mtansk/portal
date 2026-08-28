import SubmitButton from "../../buttons/submit-button/SubmitButton";
import { ActionTypes } from "../../hooks/useFormHandler";
import styles from "./buttons.module.scss";

export default function DefaultFormButtons({
    handleSaveClick,
    handleAddSaveClick,
    handleDeleteSaveClick,
    handleCancelClick,

    isValid,
    isPending,

    actionType,

    detailsOnAddPath,
    detailsOnEditPath,
}: {
    handleSaveClick: () => void;
    handleAddSaveClick: () => void;
    handleDeleteSaveClick: () => void;
    handleCancelClick: () => void;

    isValid: boolean;
    isPending: boolean;

    actionType: ActionTypes;

    detailsOnAddPath?: string;
    detailsOnEditPath?: string;
}) {
    if (actionType === "view") {
        return (
            <div className={styles.buttons_div}>
                <SubmitButton
                    text="Выйти"
                    onClick={handleCancelClick}
                />
            </div>
        );
    }
}
