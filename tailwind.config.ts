import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        border: "hsl(var(--border))",
        muted: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: { display: ["Space Grotesk Variable", "sans-serif"] },
    },
  },
} satisfies Config;
