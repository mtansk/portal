"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { startTransition } from "react";
import { useProgress } from "react-transition-progress";

export default function useParamsChanger() {
    const path = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const startProgress = useProgress();

    function changeSearchParams(paramName: string, value: string) {
        startTransition(() => {
            startProgress();
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set(paramName, value);
            const newPath = `${path}?${newSearchParams.toString()}`;
            router.push(newPath);
        });
    }

    return changeSearchParams;
}
