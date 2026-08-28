import { urlPeriodOptions } from "@/app/functions/urlPeriodOptions";
import {
    paramArrayToString,
    parseFloatAny,
    validateSearchParam,
} from "@/app/functions/other";
import { SearchParams } from "next/dist/server/request/search-params";
import { redirect } from "next/navigation";
import { FinanceHeaderPageType } from "./other/FinanceHeader";
import smartFiltering from "@/app/functions/smartFiltering";
import smartSorting from "@/app/functions/smartSorting";
import {
    AllEFOObjects,
    FinanceSearchParams,
} from "@/app/types/finance/other/FinanceTypes";
import { AllFoNames } from "@/app/types/finance/other/FinanceTypes";
import {
    isAccrual,
    isPayment,
    isReduction,
    isSheet,
    isSocialFee,
    isTax,
    isTaxDeduction,
} from "@/app/types/guards/guards";

export async function efoParamsHandler(
    searchParamsPromise: Promise<SearchParams>,
    pageType: FinanceHeaderPageType,
) {
    const searchParams = await searchParamsPromise;

    const start = paramArrayToString(searchParams.start);
    const end = paramArrayToString(searchParams.end);

    const a = validateSearchParam(searchParams.a, ["active", "archive", "all"]);
    const s = validateSearchParam(searchParams.s, [
        "last_name",
        "name",
        "date",
        "total",
        pageType.object === "accruals" ? "accrual_group_name" : "",
    ]);
    const o = validateSearchParam(searchParams.o, ["asc", "desc"]);
    const q = validateSearchParam(searchParams.q);

    const isSearchParamsValid =
        start && end && s.valid && o.valid && a.valid && q.valid;

    const periodOptions = urlPeriodOptions(
        start,
        end,
        new Set(["month", "week", "custom"]),
        "month",
    );

    if (
        !isSearchParamsValid ||
        periodOptions.start !== start ||
        periodOptions.end !== end
    ) {
        const periodString = periodOptions.string;
        const redirectURL = `/finance/${pageType.object}/${pageType.page}?q=${encodeURIComponent(
            q.value,
        )}&s=${s.value}&o=${o.value}&a=${a.value}&${periodString}`;
        redirect(redirectURL);
    } else {
        return {
            searchParams,
            periodOptions,
        };
    }
}
export function financeArrayHandler(
    array: AllEFOObjects[],
    searchParams: FinanceSearchParams,
) {
    const query = searchParams.q || "";
    const sort = searchParams.s;
    const order = searchParams.o;
    const archive = searchParams.a;

    /*     const checkedArray = filterByArchive(array, archive); */

    const checkedArray = array.filter((item) => {
        if (archive === "active") {
            return item.payslip_id === null;
        } else if (archive === "archive") {
            return item.payslip_id !== null;
        } else {
            return true;
        }
    });

    const filteredArray = smartFiltering(query, checkedArray);

    const final = smartSorting<AllEFOObjects>(filteredArray, {
        col:
            filteredArray && filteredArray[0] && sort in filteredArray[0] ?
                (sort as keyof AllEFOObjects)
            :   "last_name",
        secondaryCol: parseInt(sort || "") === 3 ? "last_name" : "date",
        order: order?.toUpperCase() === "ASC" ? "ASC" : "DESC",
    });
    return final;
}
export function getFinanceObjectType(
    object: object | undefined,
    sheetAsAccrual?: boolean,
): AllFoNames | undefined {
    if (!object) return undefined;

    switch (true) {
        case isAccrual(object):
            return "accrual";
        case isSheet(object):
            return sheetAsAccrual ? "accrual" : "sheet";
        case isReduction(object):
            return "reduction";
        case isPayment(object):
            return "payment";
        case isTax(object):
            return "tax";
        case isTaxDeduction(object):
            return "taxDeduction";
        case isSocialFee(object):
            return "socialFee";
        default:
            return undefined;
    }
}
export function calculateFOArrayTotal<TO extends { total: string | number }>(
    objects: TO[],
): number {
    let total = 0;
    if (!objects || objects.length === 0) return total;
    for (let i = 0; i < objects.length; i++) {
        total += parseFloatAny(objects[i].total);
    }
    return total;
}
export const financeSortingOptions = (
    objectType: AllFoNames,
): Map<string, string> => {
    const commonOptions = new Map();
    commonOptions.set("last_name", "По фамилии");
    commonOptions.set("name", "По названию");
    commonOptions.set("date", "По дате");
    commonOptions.set("total", "По сумме");

    if (objectType === "accrual") {
        commonOptions.set("accrual_group_name", "По группе");
    }

    return commonOptions;
};
export type PageType = "grouped" | "list" | "requested";

export function optionsVisibleInitialState(searchParams: FinanceSearchParams) {
    return (
        searchParams.a !== "active" ||
        searchParams.o !== "asc" ||
        searchParams.q !== "" ||
        searchParams.s !== "last_name"
    );
}
