export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      colors: {
        "primary": "#01A3BB",
        "secondary": "#F4F6F6",
        "tertiary": "#01495D",

      },

      backgroundImage: {
        "login": "url('/public/images/backgrounds/bg-login.webp')",
      },
    },
  },
  plugins: [

  ],
}

