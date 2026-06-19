/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sweet', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Miro design tokens
        ink: "#1c1c1e",
        canvas: "#ffffff",
        surface: "#f7f8fa",
        "surface-soft": "#fafbfc",
        hairline: "#e0e2e8",
        "hairline-soft": "#eef0f3",
        "hairline-strong": "#c7cad5",
        slate: "#555a6a",
        steel: "#6b6f7e",
        stone: "#8e91a0",
        muted: "#a5a8b5",
        // Brand accent (app sky blue)
        accent: "#34b3e0",
        "accent-deep": "#1f93c2",
        "accent-fill": "#d9f1fb",
        "accent-lite": "#f1fafe",
        // Miro yellow (for highlights)
        "brand-yellow": "#ffd02f",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        xxl: "20px",
        xxxl: "28px",
        feature: "32px",
      },
      boxShadow: {
        card: "rgba(5,0,56,0.06) 0px 4px 12px 0px",
        mockup: "rgba(5,0,56,0.08) 0px 12px 32px -4px",
        subtle: "rgba(5,0,56,0.04) 0px 1px 2px 0px",
      },
      keyframes: {
        fadeSlideIn: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeSlideIn: "fadeSlideIn 0.25s ease forwards",
        fadeIn: "fadeIn 0.2s ease forwards",
      },
    },
  },
  plugins: [],
};
