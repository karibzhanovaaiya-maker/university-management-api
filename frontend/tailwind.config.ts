import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d1117",
        card: "#161b22",
        line: "#30363d",
        accent: "#58a6ff",
        accent2: "#3fb950",
      },
    },
  },
  plugins: [],
};

export default config;
