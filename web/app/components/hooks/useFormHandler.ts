import { useState, useEffect, useRef, useLayoutEffect } from "react";

export type ActionTypes =
    | "add"
    | "edit"
    | "delete"
    | "view"
    | "template"
    | "restore";
export type FormTypes = "add" | "edit" | "template";

export function useFormHandler<TO, TI = TO>(
    initialObject: TO | TI,
    type: FormTypes,
    stateObject?: TO,
    useTemplate?: boolean,
) {
    const [object, setObject] = useState<TO>(
        stateObject ? stateObject : (initialObject as TO),
    );

    const initialType = (): ActionTypes => {
        if (type === "edit") {
            return "view";
        } else if (type === "template") {
            return "template";
        } else {
            return "add";
        }
    };

    const [actionType, setActionType] = useState<ActionTypes>(initialType);

    if (actionType === "restore") {
        setObject(stateObject ? stateObject : (initialObject as TO));
        setActionType("view");
    }

    const isDisabled = useTemplate ? false : actionType === "view";

    useEffect(() => {
        setObject(stateObject ? stateObject : (initialObject as TO));
    }, [initialObject, stateObject]);

    return {
        object,
        setObject,
        actionType,
        setActionType,
        isDisabled,
    };
}
