import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Портал",
        short_name: "Портал",
        description: `Портал для малого бизнеса: управляй зарплатой, составляй рабочие графики, взаимодействуй с сотрудниками на новом уровне. Легко. Современно. Эффективно.`,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        scope: "/",
        id: "portal",
        icons: [
            {
                src: "/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    };
}
