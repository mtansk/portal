export default function smartFiltering<T extends Record<string, any>>(
    query: string,
    array: T[] | undefined,
) {
    if (!array) {
        return;
    }

    const searchWords = query.toLowerCase().split(/\s+/);

    const searchInObject = (obj: T): boolean => {
        return searchWords.every((word) => {
            return Object.values(obj).some((value) => {
                if (value && typeof value === "object") {
                    // Рекурсивный вызов, если значение является объектом
                    return searchInObject(value as T);
                }

                if (
                    !isNaN(parseFloat(value)) &&
                    !isNaN(parseFloat(word.replace(",", ".")))
                ) {
                    // Проверка числового представления значения
                    return (
                        parseFloat(value) ===
                            parseFloat(word.replace(",", ".")) ||
                        value.toString().includes(word)
                    );
                }

                // Проверка строкового представления значения
                return value?.toString().toLowerCase().includes(word);
            });
        });
    };

    const filteredArray = array.filter((object) => searchInObject(object));

    return filteredArray;
}
