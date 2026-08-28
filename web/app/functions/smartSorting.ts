export default function smartSorting<T>(
    array: T[] | undefined,
    sorting: {
        col: keyof T;
        secondaryCol?: keyof T;
        order: "ASC" | "DESC";
    },
) {
    if (array === undefined) {
        return [];
    }

    const sortedArray = [...array].sort((a, b) => {
        const aPrimaryValue = a[sorting.col];
        const bPrimaryValue = b[sorting.col];

        let comparisonResult = compareValues<T>(
            aPrimaryValue,
            bPrimaryValue,
            sorting.order,
        );

        if (comparisonResult === 0 && sorting.secondaryCol) {
            const aSecondaryValue = a[sorting.secondaryCol];
            const bSecondaryValue = b[sorting.secondaryCol];
            comparisonResult = compareValues<T>(
                aSecondaryValue,
                bSecondaryValue,
                sorting.order,
            );
        }

        return comparisonResult;
    });

    return sortedArray;
}

function compareValues<T>(
    aValue: T[keyof T],
    bValue: T[keyof T],
    order: "ASC" | "DESC",
) {
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "ASC" ? aValue - bValue : bValue - aValue;
    } else {
        return order === "ASC" ?
                aValue
                    .toString()
                    .localeCompare(bValue.toString(), "ru", { numeric: true })
            :   bValue
                    .toString()
                    .localeCompare(aValue.toString(), "ru", { numeric: true });
    }
}
