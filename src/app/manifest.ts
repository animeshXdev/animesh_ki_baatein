import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Animesh ki Baatein — Modern Digital Publication",
    short_name: "Animesh Blog",
    description:
      "Ideas, stories and knowledge for a smarter you. Explore in-depth articles on technology, software architecture, productivity, and lifestyle.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9FE",
    theme_color: "#7434E8",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
