/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "sm": {min:'360px', max:'700px'},
        md: "769px",
        mlg: "961px",
        lg: "1024px",
        mxl: "1441px",
        xl: "1280px",
        mxl: "1441px",
        "2xl": "1536px",
        lxl: "1710px",
        '2k':{min:'1920px', max:'2559px'},
        '4k': {min:'2560px'}
      },
      fontFamily: {
        Barlow: ['Barlow', 'sans-serif']
      },
    },
  },
  plugins: [],
}