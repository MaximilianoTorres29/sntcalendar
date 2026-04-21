import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agenda Ministerial",
    short_name: "Agenda SNT",
    description: "Calendario y tareas para líderes y pastores.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f5f9",
    theme_color: "#4f8f73",
    lang: "es",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
