/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sweet', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        jua: ['Sweet', 'sans-serif'],
      },
      colors: {
        ink: "#2e3338",
        paper: "#f6fbfd",
        sky: {
          key: "#34b3e0",
          deep: "#1f93c2",
          fill: "#d9f1fb",
          lite: "#f1fafe",
          border: "#cfe6f0",
        },
        muted: "#9a958c",
        cream: "#f6e2bd",
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
        fadeSlideIn: "fadeSlideIn 0.3s ease forwards",
        fadeIn: "fadeIn 0.25s ease forwards",
      },
      boxShadow: {
        sticker: "2px 2px 0 rgba(46,51,56,0.10)",
        "sticker-md": "3px 3px 0 rgba(46,51,56,0.12)",
      },
    },
  },
  plugins: [],
};
