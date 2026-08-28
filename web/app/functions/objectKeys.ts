export type WithPrefix<T, P extends string, E extends keyof T> = {
    [N in keyof T as N extends E | "user_id" ? N : `${P}_${string & N}`]: T[N];
};

export function addPrefixToObjectKeys<
    T extends Record<string, any>,
    P extends string,
    E extends keyof T,
>(object: T, prefix: P, exceptions?: E[]): WithPrefix<T, P, E> {
    const newObj: any = {};

    exceptions?.push("user_id" as E);

    Object.keys(object).forEach((key) => {
        if (exceptions?.includes(key as E)) {
            newObj[key] = object[key];
        } else {
            newObj[`${prefix}_${key}`] = object[key];
        }
    });

    return newObj;
}

export function parseIdsToArray(
    object: {
        ids: Record<string, string[]>;
        user_id: string;
    },
    prefix: string,
) {
    const array = Object.entries(object.ids).flatMap(([userId, dates]) =>
        dates.map((date) => ({
            ...object,
            user_id: userId,
            [`${prefix}_date`]: date,
            ids: "",
        })),
    );

    return array;
}
