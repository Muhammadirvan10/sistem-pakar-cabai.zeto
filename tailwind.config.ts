import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#14532d",       // Hijau tua utama
          primary: "#166534",    // Hijau tua
          medium: "#15803d",     // Hijau medium
          light: "#22c55e",      // Hijau muda pendukung
          soft: "#dcfce7",       // Hijau sangat lembut
          accent: "#dc2626",     // Merah cabai aksen
          accentHover: "#b91c1c",
          accentSoft: "#fee2e2",
        },
      },
    },
  },
  plugins: [],
};
export default config;

