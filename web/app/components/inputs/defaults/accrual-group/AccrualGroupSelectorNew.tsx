import {
    ApiAccrualGroup,
    NullableAccrualGroup,
} from "@/app/types/accrual-group/AccrualGroups";
import InputWrapper from "../../wrapper/InputWrapper";

import styles from "./group-selector.module.scss";

export default function AccrualGroupSelectorNew({
    groups,
    selectedId,

    isDisabled,

    onChange,
    headerLike,
    className,
}: {
    groups: ApiAccrualGroup[] | NullableAccrualGroup[];
    selectedId: string | null | undefined;

    isDisabled: boolean;

    onChange: (value: ApiAccrualGroup | NullableAccrualGroup) => void;
    headerLike?: boolean;
    className?: string;
}) {
    return (
        <InputWrapper
            isDisabled={isDisabled}
            label="Группа начислений"
            headerLike={headerLike !== undefined ? headerLike : true}
            required={true}
        >
            <select
                disabled={isDisabled}
                className={styles.select}
                onChange={(e) => {
                    const group = groups.find((group) => {
                        if (e.target.value === "null") {
                            return group.accrual_group_id === null;
                        }
                        return group.accrual_group_id === e.target.value;
                    });
                    if (group) {
                        onChange(group);
                    }
                }}
                value={selectedId || "null"}
            >
                {groups.map((group) => (
                    <option
                        key={group.accrual_group_id}
                        value={group.accrual_group_id || "null"}
                    >
                        {group.accrual_group_name}
                    </option>
                ))}
            </select>
        </InputWrapper>
    );
}
