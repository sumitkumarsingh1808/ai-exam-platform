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
        nta: {
          blue: "#0d47a1",
          lightBlue: "#e3f2fd",
          headerBlue: "#1976d2",
          navBg: "#f8f9fa",
          answered: "#22c55e", // Green polygon / box
          notAnswered: "#ef4444", // Red polygon / box
          notVisited: "#cbd5e1", // Slate/Gray
          review: "#8b5cf6", // Purple/Violet circle
          reviewAnswered: "#7c3aed", // Violet with green dot
          border: "#e2e8f0",
          cardBg: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
export default config;
