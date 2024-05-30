/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.{html,js,ejs}",
    "./views/mahasiswa/*.{html,js,ejs}",
    "./views/admin/*.{html,js,ejs}",
    "./views/lptik/*.{html,js,ejs}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
      colors: {
        customGray: "rgba(243,244,246,255)",
        hijauUnand: "rgba(75,149,82,255)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("preline/plugin")],
};
