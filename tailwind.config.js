/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.75s ease-in-out forwards",
        fadeOut: "fadeOut 0.5s ease-in-out forwards",
        zoomIn: "zoomIn 0.75s ease-in-out forwards",
        zoomOut: "zoomOut 0.5s ease-in-out forwards",
        shake: "shake 0.5s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        flash: "flash 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        zoomIn: {
          "0%": { transform: "scale(0.5)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        zoomOut: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(1.5)", opacity: 0 },
        },
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "75%": { transform: "rotate(-5deg)" },
        },
        flash: {
          "0%, 100%": { opacity: 0 },
          "25%": { opacity: 1 },
          "75%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
