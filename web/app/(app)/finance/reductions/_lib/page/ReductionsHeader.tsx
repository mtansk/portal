"use client";

import { startTransition, Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";
import { FinanceSearchParams } from "@/app/types/finance/other/FinanceTypes";

import styles from "./css/header.module.scss";
import AddModal from "../../../_lib/form/header-add-modal/AddModal";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import { PageType } from "../../../_lib/functions";
import { FinanceHeaderOptions } from "../../../_lib/header/FinanceHeaderOptions";
import HorizontalNavContainerNew from "@/app/components/horizontal-nav-new/HorizontalNavContainerNew";
import { useProgress } from "react-transition-progress";
import { Button } from "@/app/components/buttons/Buttons";

export default function ReductionsHeader({
    searchParams,
    page,

    users,
    depts,
}: {
    searchParams: FinanceSearchParams;
    page: PageType;

    users: Promise<ApiUser[]>;
    depts: Promise<ApiDept[]>;
}) {
    const [searchQuery, setSearchQuery] = useState(searchParams.q);

    const path = usePathname();
    const router = useRouter();
    const startProgress = useProgress();

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== searchParams.q) {
                startTransition(() => {
                    startProgress();
                    const URLparams = new URLSearchParams(searchParams);
                    URLparams.set("q", searchQuery);
                    router.replace(`${path}?${URLparams.toString()}`);
                });
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery, searchParams, path, router, startProgress]);

    function handleParamsChange(name: string, value: string) {
        const URLparams = new URLSearchParams(searchParams);
        URLparams.set(name, value);
        router.replace(`${path}?${URLparams.toString()}`);
    }

    const navLinksConstructor = () => {
        const path = "reductions";

        const paramsString = `start=${searchParams.start}&end=${
            searchParams.end
        }&q=${searchParams.q}&s=${searchParams.s}&o=${searchParams.o}&a=${
            searchParams.a
        }`;

        return [
            {
                name: "По сотрудникам",
                href: `/finance/${path}/grouped?${paramsString}`,
            },
            {
                name: "Списком",
                href: `/finance/${path}/list?${paramsString}`,
            },
        ];
    };

    return (
        <>
            {dialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <AddModal
                        objectPath={`/finance/reductions`}
                        _users={users}
                        _depts={depts}
                    />
                </ModalPortal>
            )}
            <div className={styles.finance_header_div}>
                <div className={styles.main_div}>
                    <div className={styles.title}>Удержания</div>
                    <div className={styles.nav}>
                        <Suspense>
                            <HorizontalNavContainerNew
                                links={navLinksConstructor()}
                            />
                        </Suspense>
                    </div>
                    <div className={styles.add_div}>
                        <Button
                            type="nav"
                            colors="nav-blue"
                            innerContent="Добавить удержание"
                            onClick={() => {
                                setDialogIsOpen(true);
                            }}
                        />
                    </div>
                    <div className={styles.options}>
                        <FinanceHeaderOptions
                            page={page}
                            object="reduction"
                            searchParams={searchParams}
                            handleParamsChange={handleParamsChange}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </div>
                    <div className={styles.period}>
                        <PeriodPicker
                            allowedPeriods={
                                new Set(["month", "week", "custom"])
                            }
                            defaultPeriod="month"
                            initialParams={searchParams}
                            shouldUseURL={true}
                            key={searchParams.start + searchParams.end}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
