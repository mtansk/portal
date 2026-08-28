"use client";

import FinanceStandardBlock from "./FinanceStandardBlock";
import { FinanceCurrencyStringNew } from "../../other/FinanceCurrencyString";
import { getFinanceObjectType } from "../../functions";
import { ApiUser } from "@/app/types/user/Users";

import styles from "./css/user.module.scss";

import { ExpandableUserGroup } from "./ExpandableUserGroup";
import { ArrayWithTotal } from "@/app/types/finance/other/FinanceTypes";
import { Link } from "react-transition-progress/next";
import useBackURL from "@/app/components/hooks/useBackURL";
import { AllEFOObjects } from "@/app/types/finance/other/FinanceTypes";

export default function FinanceStandardUserGroup({
    arrayOfObjects,
    user,
    onObjectClick,

    storageTag,
    addPath,
}: {
    arrayOfObjects: ArrayWithTotal<AllEFOObjects>;
    user: ApiUser;
    onObjectClick: (object: AllEFOObjects) => void;

    storageTag: string;
    addPath?: string;
}) {
    const userTotal = arrayOfObjects.total;

    return (
        <ExpandableUserGroup
            storageTag={storageTag}
            total={
                <FinanceCurrencyStringNew
                    total={userTotal}
                    type={getFinanceObjectType(arrayOfObjects.array[0])}
                />
            }
            user={user}
        >
            <div className={styles.objects}>
                {arrayOfObjects.array.map((object) => {
                    return (
                        <FinanceStandardBlock
                            object={object}
                            onObjectClick={onObjectClick}
                            grouped={true}
                            key={object.id}
                        />
                    );
                })}
                <div className={`${styles.object_div} ${styles.empty}`}>
                    {arrayOfObjects?.array.length === 0 && (
                        <div className={styles.empty_text}>
                            Нет элементов с текущими фильтрами.
                        </div>
                    )}
                    <AddLink
                        addPath={addPath}
                        user_id={user.user_id}
                    />
                </div>
            </div>
        </ExpandableUserGroup>
    );
}

function AddLink({ addPath, user_id }: { addPath?: string; user_id: string }) {
    const backurl = useBackURL();
    if (!addPath) return null;
    return (
        <Link
            prefetch={false}
            href={`${addPath}/add?uid=${user_id}&backurl=${backurl}`}
            className={styles.add}
        >
            Добавить?
        </Link>
    );
}
