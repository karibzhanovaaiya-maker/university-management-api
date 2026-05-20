import type { Config } from "tailwindcss";

// Colors are CSS variables (RGB triplets) so light/dark both work via [data-theme].
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        card: v("card"),
        line: v("line"),
        fg: v("fg"),
        muted: v("muted"),
        accent: v("accent"),
        accent2: v("accent2"),
        code: v("code"),
      },
    },
  },
  plugins: [],
};

export default config;
