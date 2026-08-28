/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";

const LazyScript = dynamic(() => import("./MetrikaScript"), {
    ssr: false,
});
export default function MetrikaComponent() {
    return (
        <>
            <LazyScript />
            <div>
                <img
                    src="https://mc.yandex.ru/watch/100486848"
                    style={{ position: "absolute", left: "-9999px" }}
                    alt=""
                />
            </div>
        </>
    );
}
