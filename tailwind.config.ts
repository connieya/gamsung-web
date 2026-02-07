import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#1a1a1a",
          gray: "#757575",
          border: "#ebebeb",
          bg: "#f8f8f8",
          white: "#ffffff",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Noto Sans KR",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-lg": ["2rem", { lineHeight: "1.2" }],
        "display": ["1.5rem", { lineHeight: "1.3" }],
        "title": ["1.125rem", { lineHeight: "1.4" }],
        "body": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
