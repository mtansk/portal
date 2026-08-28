"use client";

import { Formatter } from "@/app/classes/Formatter";
import { ApiDefaultSheet } from "@/app/types/default-sheet/DefaultSheets";
import { memo } from "react";
import styles from "./css/body.module.scss";
import { timeFromSeconds } from "@/app/functions/dates";

const DefaultSheetsBody = memo(function DefaultSheetsBody({
    sheets,

    onSheetClick,
}: {
    sheets: ApiDefaultSheet[];

    onSheetClick: (id: string) => void;
}) {
    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.sheets_div}>
                    {sheets.map((sheet) => {
                        return (
                            <div
                                className={styles.sheet_div}
                                key={sheet.def_sheet_id}
                                onClick={() => onSheetClick(sheet.def_sheet_id)}
                            >
                                <div className={styles.name}>
                                    {sheet.def_sheet_name}
                                </div>
                                <div className={styles.time}>
                                    {`${timeFromSeconds(sheet.def_sheet_st || 0)} — ${timeFromSeconds(sheet.def_sheet_en || 0)}`}
                                </div>
                                <div className={styles.hours}>
                                    {timeFromSeconds(sheet.def_sheet_dur)}
                                </div>
                            </div>
                        );
                    })}
                    {sheets.length === 0 && (
                        <div
                            className={styles.empty}
                        >{`Шаблонов смен нет. Они нужны для быстрого заполнения времени при создании смен.`}</div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default DefaultSheetsBody;
