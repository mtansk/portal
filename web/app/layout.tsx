import "./globals.css";

import { Jost } from "next/font/google";

import modalStyles from "./css/form.module.scss";

import ClientAccessStateProvider from "./context/auth/ClientAccessStateContext";
import InfoMessageProvider from "./context/info/InfoMessage";

import { ProgressBarProvider } from "react-transition-progress";
import ProgressBar from "./components/loading/progress-bar/ProgressBar";
import { Metadata } from "next";
import MetrikaComponent from "./components/scripts/Metrika";

export const metadata: Metadata = {
    title: "Портал для бизнеса",
    description: `Портал для малого бизнеса: управляй зарплатой, составляй рабочие графики, взаимодействуй с сотрудниками на новом уровне. Легко. Современно. Эффективно.`,
    keywords:
        "корпоративный портал, управление зарплатой, рабочие графики, финансы, зарплата, смены, сотрудники, бизнес, портал для бизнеса",
};

const Jost_Font = Jost({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    display: "swap",
    subsets: ["latin", "cyrillic"],
    variable: "--jost",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            className={`${Jost_Font.variable}`}
            lang="ru"
        >
            <body>
                <ClientAccessStateProvider>
                    <InfoMessageProvider>
                        <ProgressBarProvider>
                            <ProgressBar />
                            {children}
                            <div
                                id="modal-root"
                                className={modalStyles.root}
                            ></div>
                        </ProgressBarProvider>
                    </InfoMessageProvider>
                </ClientAccessStateProvider>
                <MetrikaComponent />
            </body>
        </html>
    );
}

const icons = [
    "keyboard_arrow_right",
    "widgets",
    "account_circle",
    "switch_access_shortcut",
    "refresh",
    "arrow_back_ios_new",
    "arrow_back_ios",
    "arrow_forward_ios_new",
    "arrow_forward_ios",
    "edit",
    "visibility_off",
    "archive",
    "keyboard_arrow_down",
    "delete",
    "arrow_downward",
    "arrow_upward",
    "close",
    "search",
    "keyboard_double_arrow_up",
    "close_small",
    "delete_forever",
    "edit_calendar",
    "savings",
    "download",
    "circles_ext",
    "currency_ruble",
    "event_note",
    "calendar_month",
    "add",
    "remove",
    "checkbook",
    "account_balance",
    "donut_large",
    "list",
    "work_history",
    "open_in_new",
    "date_range",
    "person_add",
];

/* console.log(icons.sort().join(",")); */
