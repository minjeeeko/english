/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sweet', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeSlideIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(14,165,233,0.3), 0 0 0 4px rgba(14,165,233,0.1)" },
          "50%": { boxShadow: "0 0 0 6px rgba(14,165,233,0.15), 0 0 0 10px rgba(14,165,233,0.05)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        fadeSlideIn: "fadeSlideIn 0.4s ease forwards",
        "pulse-ring": "pulseRing 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
