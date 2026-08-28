import { useCallback, useMemo, useState } from "react";
import { FormTypes } from "./useFormHandler";

export type ObjectModification<T> = Partial<Record<keyof T, unknown>>;

export function useFormMainHandler<T extends object, D extends object>(
    arrayOfObjects: T[],
    idProperty: keyof T,
    defaultObject: D,
) {
    const [initialObjectId, setInitialObjectId] = useState<string | undefined>(
        undefined,
    );
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
    const [type, setType] = useState<FormTypes>("edit");
    const [objectModification, setObjectModification] =
        useState<ObjectModification<D>>();

    const initialObject = useMemo(() => {
        const obj =
            type === "edit" ?
                arrayOfObjects?.find(
                    (object) => object[idProperty] === initialObjectId,
                )
            :   { ...defaultObject };
        return obj;
    }, [type, arrayOfObjects, idProperty, initialObjectId, defaultObject]);

    if (type === "add") {
        if (initialObject) {
            Object.assign(initialObject, objectModification);
        }
    }

    const handleObjectClick = useCallback(
        (
            id: string,
            type: FormTypes = "edit",
            objectModification?: Partial<Record<keyof D, unknown>>,
        ) => {
            setInitialObjectId(id);
            setType(type);
            setObjectModification(objectModification);
            setDialogIsOpen(true);
        },
        [setDialogIsOpen, setInitialObjectId],
    );

    return {
        setInitialObjectId,

        initialObject,

        dialogIsOpen,
        setDialogIsOpen,

        handleObjectClick,

        type,
        setType,
    };
}
