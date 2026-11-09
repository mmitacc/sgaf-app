/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Permite activar el modo oscuro mediante la clase .dark en el HTML
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        },
        bg: {
          base: "rgb(var(--color-bg-base) / <alpha-value>)",
          surface: "rgb(var(--color-bg-surface) / <alpha-value>)",
        },
        text: {
          base: "rgb(var(--color-text-base) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
