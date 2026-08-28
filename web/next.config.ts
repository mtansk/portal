import { NextConfig } from "next";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    output: "standalone",
    reactStrictMode: true,
    devIndicators: {
        position: "top-right",
    },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
