"use client";

import { DebtsSearchParams } from "../../page";
import styles from "./css/header.module.scss";
import useBackURL from "@/app/components/hooks/useBackURL";
import { Suspense } from "react";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import useParamsChanger from "../../../../../components/hooks/useParamsChanger";
import { Button } from "@/app/components/buttons/Buttons";

export default function DebtsHeader({
    searchParams,
}: {
    searchParams: DebtsSearchParams;
}) {
    const changeParams = useParamsChanger();

    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Задолженности</div>
                <div className={styles.add}>
                    <Suspense>
                        <AddButton />
                    </Suspense>
                </div>
                <div className={styles.options}>
                    <CustomCheckbox
                        text="Показать погашенные"
                        value={searchParams.settled === "true"}
                        isDisabled={false}
                        onChange={(value) =>
                            changeParams("settled", String(value))
                        }
                        className={styles.checkbox}
                    />
                </div>
                {searchParams.uid && (
                    <div className={styles.filter}>
                        Включен фильтр по сотруднику.
                        <button
                            type="button"
                            className={styles.filter_button}
                            onClick={() => changeParams("uid", "")}
                        >
                            Сбросить
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function AddButton() {
    const backurl = useBackURL();

    return (
        <Button
            href={`/finance/debts/add?backurl=${backurl}`}
            type="nav"
            colors="nav-blue"
            innerContent="Добавить задолженность"
        />
    );
}
