"use client";

import {
    EFONames,
    FinanceSearchParams,
} from "@/app/types/finance/other/FinanceTypes";
import {
    PageType,
    financeSortingOptions,
    optionsVisibleInitialState,
} from "../functions";

import styles from "./options.module.scss";
import { startTransition, useState } from "react";
import { useProgress } from "react-transition-progress";

export function FinanceHeaderOptions({
    page,
    object,

    searchParams,
    handleParamsChange,
    searchQuery,
    setSearchQuery,
}: {
    page: PageType;
    object: EFONames;

    searchParams: FinanceSearchParams;
    handleParamsChange: (name: string, value: string) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}) {
    const [optionsVisible, setOptionsVisible] = useState(() =>
        optionsVisibleInitialState(searchParams),
    );

    const startProgress = useProgress();

    if (!optionsVisible) {
        return (
            <div className={styles.options_div}>
                <button
                    type="button"
                    className={styles.filters_button}
                    onClick={() => setOptionsVisible(true)}
                >
                    Показать фильтры
                </button>
            </div>
        );
    }

    return (
        <div className={styles.options_div}>
            <select
                value={searchParams.a}
                onChange={(e) => handleParamsChange("a", e.target.value)}
            >
                <option value="all">Все</option>
                <option value="active">Активные</option>
                <option value="archive">Архивные</option>
            </select>
            {page === "list" && (
                <div className={styles.sort}>
                    <select
                        value={searchParams.s}
                        onChange={(e) =>
                            startTransition(() => {
                                startProgress();
                                handleParamsChange("s", e.target.value);
                            })
                        }
                    >
                        {Array.from(financeSortingOptions(object)).map(
                            ([key, value]) => (
                                <option
                                    key={key}
                                    value={key}
                                >
                                    {value}
                                </option>
                            ),
                        )}
                    </select>
                    <button className={styles.i_h}>
                        <div className="icon">
                            {!searchParams.o || searchParams.o === "asc" ?
                                <div
                                    onClick={() =>
                                        startTransition(() => {
                                            startProgress();
                                            handleParamsChange("o", "desc");
                                        })
                                    }
                                >
                                    arrow_downward
                                </div>
                            :   <div
                                    onClick={() =>
                                        startTransition(() => {
                                            startProgress();
                                            handleParamsChange("o", "asc");
                                        })
                                    }
                                >
                                    arrow_upward
                                </div>
                            }
                        </div>
                    </button>
                </div>
            )}
            <div className={styles.filter}>
                <input
                    type="text"
                    placeholder="Фильтр"
                    value={searchQuery || ""}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery ?
                    <div
                        className={"icon " + styles.icon + " " + styles.close}
                        onClick={() => setSearchQuery("")}
                    >
                        close
                    </div>
                :   <div className={"icon " + styles.icon}>search</div>}
            </div>
        </div>
    );
}
