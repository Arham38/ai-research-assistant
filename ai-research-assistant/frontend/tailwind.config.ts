import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2A4A",
          light: "#3D4F73",
          faint: "#6B7690",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F6F8",
        },
        margin: "#DCE1E8",
        highlighter: {
          DEFAULT: "#F5C518",
          soft: "#FDF3C4",
        },
        citation: "#4A6FA5",
        sage: "#4B7F6B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "4px",
      },
      keyframes: {
        "highlight-sweep": {
          "0%": { width: "0%", opacity: "0" },
          "15%": { opacity: "1" },
          "70%": { width: "100%", opacity: "1" },
          "100%": { width: "100%", opacity: "0.85" },
        },
        "card-rise": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "highlight-sweep": "highlight-sweep 2.4s ease-in-out infinite",
        "card-rise": "card-rise 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;