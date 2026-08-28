import smartFiltering from "@/app/functions/smartFiltering";
import { useMemo, useState } from "react";
import styles from "./search.module.scss";

export default function useSearchInput<T extends Record<string, any>>(
    array: T[],
) {
    const [search, setSearch] = useState<string>("");

    const filteredArray = useMemo(
        () => smartFiltering(search, array) || [],
        [search, array],
    );

    return { search, setSearch, filteredArray };
}

export function SearchInput({
    search,
    setSearch,
}: {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <div className={styles.search_input}>
            <input
                type="text"
                placeholder="Поиск"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.input}
            />
            <button
                className={styles.button + " icon"}
                type="button"
                onClick={() => {
                    if (search) {
                        setSearch("");
                    }
                }}
            >
                {search ? "close" : "search"}
            </button>
        </div>
    );
}
