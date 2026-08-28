import FormHandler from "@/app/components/form/FormHandler";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { IDBAccrualGroup } from "@/app/types/accrual-group/AccrualGroups";

import styles from "./css/accrual-group-form.module.scss";
import { putAccrualGroup } from "@/app/server-actions/accrual-groups/putAccrualGroup";
import { postAccrualGroup } from "@/app/server-actions/accrual-groups/postAccrualGroup";

export type FormAccrualGroup = IDBAccrualGroup;

export default function AccrualGroupForm({
    initialGroup,

    type,
    view,

    setDialogIsOpen,
}: {
    initialGroup: FormAccrualGroup;

    type: FormTypes;
    view: "page" | "modal";

    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const {
        object: group,
        setObject,
        actionType,
        isDisabled,
        setActionType,
    } = useFormHandler(initialGroup, type);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        setObject({ ...group, [e.target.name]: e.target.value });
    }

    return (
        <FormHandler
            object={group}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            setDialogIsOpen={setDialogIsOpen}
            title="Группа начислений"
            actions={{
                putAction: async () => putAccrualGroup(group),
                postAction: async () => postAccrualGroup(group),
            }}
            deleteDialogOptions={{
                deleteDialogText: `Группы начислений нельзя удалять для сохранения целостности данных.`,
                isDisabled: true,
            }}
        >
            <div className={styles.main_div}>
                <div className={styles.name}>
                    <NameInput
                        isDisabled={isDisabled}
                        onChange={handleChange}
                        name="accrual_group_name"
                        value={group.accrual_group_name}
                    />
                </div>
            </div>
        </FormHandler>
    );
}
