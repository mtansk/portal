import { Formatter } from "@/app/classes/Formatter";
import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";

import { calculateFOArrayTotal } from "../../functions";
import { FinanceDeptBlock } from "../components/FinanceDeptBlock";
import {
    AllEFOObjects,
    ArrayWithTotal,
} from "@/app/types/finance/other/FinanceTypes";
import FinanceStandardUserGroup from "../components/FinanceStandardUserGroup";

export default function FinanceBodyGrouped({
    sortedDepts,
    sortedUsers,
    arrayOfObjects,
    storageTag,
    onObjectClick,
    addPath,
}: {
    sortedDepts: ApiDept[];
    sortedUsers: ApiUser[];
    arrayOfObjects: ArrayWithTotal<AllEFOObjects>;
    storageTag: string;
    onObjectClick: (object: AllEFOObjects) => void;
    addPath?: string;
}) {
    return (
        <>
            {sortedDepts.map((dept) => {
                const deptUsers = sortedUsers?.filter(
                    (user) => user.department_id === dept.department_id,
                );
                const deptObjects = arrayOfObjects.array.filter(
                    (object) => object.department_id === dept.department_id,
                );

                if (deptUsers.length === 0) return null;

                return (
                    <FinanceDeptBlock
                        dept={dept}
                        total={Formatter.currencyString({
                            value: calculateFOArrayTotal(deptObjects),
                        })}
                        key={dept.department_id}
                    >
                        {deptUsers?.map((user) => {
                            const array = deptObjects.filter(
                                (object) => object.user_id === user.user_id,
                            );
                            const userObjects = {
                                array: array,
                                total: calculateFOArrayTotal(array),
                            };

                            return (
                                <FinanceStandardUserGroup
                                    arrayOfObjects={userObjects}
                                    user={user}
                                    key={user.user_id}
                                    storageTag={storageTag}
                                    onObjectClick={onObjectClick}
                                    addPath={addPath}
                                />
                            );
                        })}
                    </FinanceDeptBlock>
                );
            })}
        </>
    );
}
