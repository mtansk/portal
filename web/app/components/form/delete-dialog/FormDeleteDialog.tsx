import { FormButtons } from "../buttons/FormButtons";
import { DeleteDialogOptions } from "../FormHandler";
import { ModalPortal } from "../ModalPortal";
import styles from "./delete-dialog.module.scss";

export default function FormDeleteDialog({
    dialogIsOpen,
    setDialogIsOpen,
    options,

    onDeleteClick,
}: {
    dialogIsOpen: boolean;
    setDialogIsOpen: (isOpen: boolean) => void;

    options?: DeleteDialogOptions;

    onDeleteClick: () => void;
}) {
    return (
        <ModalPortal
            dialogIsOpen={dialogIsOpen}
            setDialogIsOpen={setDialogIsOpen}
        >
            <div className={styles.main_div}>
                <div className={styles.text}>
                    {options?.deleteDialogText ?
                        options?.deleteDialogText
                    :   <>
                            Вы уверены, что хотите удалить этот объект? <br />
                            <b>Это действие может быть необратимо.</b>
                        </>
                    }
                </div>
                <FormButtons
                    notation={{
                        left: [
                            {
                                text: "Удалить",
                                style: "b",
                                onClick: () => {
                                    onDeleteClick();
                                    setDialogIsOpen(false);
                                },
                                disabled: options?.isDisabled ?? false,
                            },
                        ],
                        right: [
                            {
                                text: "Отмена",
                                style: "g",
                                onClick: () => setDialogIsOpen(false),
                            },
                        ],
                    }}
                />
            </div>
        </ModalPortal>
    );
}
