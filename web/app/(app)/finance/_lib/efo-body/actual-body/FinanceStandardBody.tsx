"use client";

import smartSorting from "@/app/functions/smartSorting";
import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import { memo, useMemo } from "react";

import styles from "./css/body.module.scss";
import dynamic from "next/dynamic";
import { calculateFOArrayTotal } from "../../functions";
import { AllEFOObjects } from "@/app/types/finance/other/FinanceTypes";

const BodyList = dynamic(() => import("./FinanceBodyLazyList"));
const BodyGrouped = dynamic(() => import("./FinanceBodyLazyGrouped"), {
    loading: () => <div>Загрузка...</div>,
});

export const EFOStorageTag = "EFOGrouped";

export const FinanceStandardBody = memo(function FinanceStandardBody({
    arrayOfObjects,
    typeOfPage,

    users,
    depts,

    onObjectClick,
    addPath,
}: {
    arrayOfObjects: AllEFOObjects[];
    typeOfPage: "list" | "grouped";

    users: ApiUser[];
    depts: ApiDept[];

    onObjectClick: (object: AllEFOObjects) => void;
    addPath?: string;
}) {
    const sortedUsers = useMemo(() => {
        return smartSorting<ApiUser>(users, {
            col: "last_name",
            order: "ASC",
        });
    }, [users]);

    const obj = {
        array: arrayOfObjects,
        total: calculateFOArrayTotal(arrayOfObjects),
    };

    return (
        <div className={styles.finance_body_div + " " + styles[typeOfPage]}>
            <div className={styles.main_div}>
                {typeOfPage === "list" ?
                    <BodyList
                        arrayOfObjects={obj}
                        onObjectClick={onObjectClick}
                    />
                :   <BodyGrouped
                        sortedDepts={depts}
                        sortedUsers={sortedUsers}
                        arrayOfObjects={obj}
                        storageTag={EFOStorageTag}
                        onObjectClick={onObjectClick}
                        addPath={addPath}
                    />
                }
            </div>
        </div>
    );
});
