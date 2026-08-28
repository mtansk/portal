"use client";

import GeneralRatesHeader from "./GeneralRatesHeader";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import GeneralRatesBody from "./GeneralRatesBody";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import {
    ApiGeneralRate,
    defaultGeneralRateObject,
} from "@/app/types/general-rate/GeneralRates";
import {
    ApiAccrualGroup,
    defaultAccrualGroupObject,
} from "@/app/types/accrual-group/AccrualGroups";
import GeneralRateForm from "../form/GeneralRateForm";
import AccrualGroupForm from "../form/AccrualGroupForm";
import dynamic from "next/dynamic";
import FormLoading from "@/app/components/form/FormLoading";

const RateFormLazy = dynamic(() => import("../form/GeneralRateForm"), {
    loading: () => <FormLoading />,
});

const GroupFormLazy = dynamic(() => import("../form/AccrualGroupForm"), {
    loading: () => <FormLoading />,
});

export default function GeneralRatesMain({
    rates,
    groups,
}: {
    rates: ApiGeneralRate[];
    groups: ApiAccrualGroup[];
}) {
    const {
        dialogIsOpen: rateDialogIsOpen,
        setDialogIsOpen: setRateDialogIsOpen,
        initialObject: rate,
        handleObjectClick: handleRateClick,
        type: rateDialogType,
    } = useFormMainHandler(rates, "general_rate_id", defaultGeneralRateObject);

    const {
        dialogIsOpen: groupDialogIsOpen,
        setDialogIsOpen: setGroupDialogIsOpen,
        initialObject: group,
        handleObjectClick: handleGroupClick,
        type: groupDialogType,
    } = useFormMainHandler(
        groups,
        "accrual_group_id",
        defaultAccrualGroupObject,
    );

    return (
        <>
            {rateDialogIsOpen && rate && (
                <ModalPortal
                    dialogIsOpen={rateDialogIsOpen}
                    setDialogIsOpen={setRateDialogIsOpen}
                >
                    <RateFormLazy
                        initialRate={rate}
                        groups={groups}
                        type={rateDialogType}
                        view="modal"
                        setDialogIsOpen={setRateDialogIsOpen}
                    />
                </ModalPortal>
            )}
            {groupDialogIsOpen && group && (
                <ModalPortal
                    dialogIsOpen={groupDialogIsOpen}
                    setDialogIsOpen={setGroupDialogIsOpen}
                >
                    <GroupFormLazy
                        initialGroup={group}
                        type={groupDialogType}
                        view="modal"
                        setDialogIsOpen={setGroupDialogIsOpen}
                    />
                </ModalPortal>
            )}
            <GeneralRatesHeader
                onAddRateClick={() => handleRateClick("-1", "add")}
                onAddGroupClick={() => handleGroupClick("-1", "add")}
            />
            <GeneralRatesBody
                groups={groups}
                rates={rates}
                onRateClick={handleRateClick}
                onGroupClick={handleGroupClick}
            />
        </>
    );
}
