/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#01A3BB",
        "secondary": "#F4F6F6",
        "tertiary": "#01495D",
        // "quaternary": "#F7F7F7",
      },
      
      backgroundImage: {
        "login": "url('/public/images/backgrounds/bg-login.webp')",
      },
    },
  },
  plugins: [],
} 