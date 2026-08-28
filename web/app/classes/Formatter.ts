import { UTCDate } from "@date-fns/utc";

export class Formatter {
    public static currencyString({
        value,
        signDisplay,
        prettyMinus,
    }: {
        value: number | string | null | undefined;
        signDisplay?: keyof Intl.NumberFormatOptionsSignDisplayRegistry;
        prettyMinus?: boolean;
        trim?: boolean;
    }): string {
        const validValue = this.parseFloat(value);

        if (prettyMinus) {
            return `${validValue < 0 ? "− " : ""}${validValue.toLocaleString(
                "ru-RU",
                {
                    style: "currency",
                    currency: "RUB",
                    signDisplay: "never",
                },
            )}`;
        }

        return validValue.toLocaleString("ru-RU", {
            style: "currency",
            currency: "RUB",
            signDisplay: signDisplay,
        });
    }

    public static floatString(
        value: number | string | null | undefined,
        signDisplay?: keyof Intl.NumberFormatOptionsSignDisplayRegistry,
    ) {
        const validValue = this.parseFloat(value);

        return validValue.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            signDisplay: signDisplay,
        });
    }

    private static parseFloat(
        value: number | string | null | undefined,
    ): number {
        const parsedValue =
            value == null ? 0
            : typeof value === "string" ? parseFloat(value)
            : value;
        return isNaN(parsedValue) ? 0 : parsedValue;
    }

    public static date(date: Date | UTCDate, format: "fullRu" | "shortRu") {
        switch (format) {
            case "fullRu":
                return Intl.DateTimeFormat("ru-RU", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                }).format(date);
            case "shortRu":
                return Intl.DateTimeFormat("ru-RU", {
                    day: "numeric",
                    month: "short",
                    weekday: "short",
                }).format(date);
        }
    }
}
