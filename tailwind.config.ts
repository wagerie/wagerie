import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fcfcfc",
        secondary: "#b1b4bb",
        "main-bg": "#12151e",
        "dark-bg": "#323846",
        "secondary-dark-bg": "#1c202c",
        cards: "#20242f",
        hover: "#323846",
        "border-color": "#3d4353",
        separator: "#363a46",
      },
      boxShadow: {
        testimonial:
          "0px 20px 24px -4px rgba(0, 0, 0, 0.10), 0px 8px 8px -4px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
