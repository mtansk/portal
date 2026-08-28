import { usePathname, useSearchParams } from "next/navigation";

export default function useBackURL() {
    const path = usePathname();
    const paramsString = useSearchParams().toString();

    return encodeURIComponent(`${path}?${paramsString}`);
}
