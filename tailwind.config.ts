import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FCFAF6",
        ring: "#2E4053",
        ivory: "#FCFAF6",
        ink: "#1C2833",
        mute: "#5E6A75",
        line: "#E4DDD2",
        slatebrand: "#2E4053",
        slatedeep: "#243444",
        gold: "#F1C40F",
        goldink: "#8A6D12",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "Helvetica", "Arial", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "Times New Roman", "serif"],
        hindi: ["var(--font-arya)", "serif"],
      },
      maxWidth: {
        page: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
