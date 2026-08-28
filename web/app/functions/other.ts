export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function parseFloatAny(
    value: number | string,
    maxDecimals?: number,
): number {
    let _value = 0;

    if (typeof value === "number") {
        _value = maxDecimals ? parseFloat(value.toFixed(maxDecimals)) : value;
    }

    if (typeof value === "string") {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            _value =
                maxDecimals ?
                    parseFloat(parsedValue.toFixed(maxDecimals))
                :   parsedValue;
        }
    }

    return _value;
}

export function numberPadStart(value: number): string {
    return value.toString().padStart(2, "0");
}

export function getUserFullnameString(
    user: {
        first_name: string;
        last_name: string | null;
        middle_name: string | null;
    },
    addMiddleName?: boolean,
): string {
    return `${user.last_name || ""} ${user.first_name}${addMiddleName && user.middle_name ? ` ${user.middle_name || ""}` : ""}`;
}

export function paramArrayToString(
    params: string | string[] | undefined,
): string {
    if (Array.isArray(params)) {
        return params[0];
    }
    return params || "";
}

export function validateSearchParam<V extends string>(
    params: string | string[] | undefined,
    allowedValues?: Array<V>,
): { valid: true; value: V } | { valid: false; value: V } {
    const param = paramArrayToString(params);

    if (allowedValues && allowedValues.includes(param as V)) {
        return {
            valid: true,
            value: param as V,
        };
    } else if (allowedValues) {
        return {
            valid: false,
            value: allowedValues[0],
        };
    }

    return {
        valid: true,
        value: param as V,
    };
}
