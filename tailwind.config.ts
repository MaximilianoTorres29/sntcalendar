import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7f5",
          100: "#dcebe3",
          300: "#9cc8b0",
          500: "#4f8f73",
          700: "#2f664d"
        }
      },
      boxShadow: {
        card: "0 6px 18px rgba(38, 66, 52, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
