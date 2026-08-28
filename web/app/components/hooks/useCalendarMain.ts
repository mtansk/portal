import { useState, useEffect, useCallback } from "react";
import { IDBEntityClass } from "@/app/classes/IDBEntityClass";
import { IdDateMapper } from "@/app/classes/IdDateMapper";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { useServerAction } from "./useServerAction";

export default function useCalendarMain<
    TO,
    TCO extends IDBEntityClass<TCO> & {
        idDateMap: IdDateMapper;
    },
    TF,
>({
    arrayOfObjects,
    postDBO,
}: {
    arrayOfObjects: TO[];
    postDBO: (object: TF) => Promise<ApiResponse<unknown>>;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [templateObject, setTemplateObject] = useState<TCO | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const serverAction = useServerAction();

    useEffect(() => {
        setTemplateObject(null);
    }, [isAdding]);

    useEffect(() => {
        setIsLoading(false);
        setIsAdding(false);
        setTemplateObject(null);
    }, [arrayOfObjects]);

    function getDisabledSaveButton() {
        return !Array.from(templateObject?.idDateMap.map.entries() || []).some(
            ([id, dateSet]) => id !== IdDateMapper.default && dateSet.size > 0,
        );
    }

    const disabledSaveButton = getDisabledSaveButton();

    const handleSaveClick = useCallback(async () => {
        if (!templateObject) return;
        const DBobj = templateObject.createSQLObject() as TF;
        setIsLoading(true);

        const res = await serverAction({
            serverAction: () => postDBO(DBobj),
            showSuccess: true,
        });

        if (res) {
        } else {
            setIsLoading(false);
        }
    }, [templateObject, postDBO, serverAction]);

    const after = useCallback(() => {
        setIsLoading(true);
        return () => setIsLoading(false);
    }, []);

    return {
        isAdding,
        setIsAdding,
        templateObject,
        setTemplateObject,
        isLoading,
        setIsLoading,
        disabledSaveButton,
        handleSaveClick,
        after,
    };
}
