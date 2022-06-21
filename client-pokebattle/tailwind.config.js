module.exports = {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        "-1": "-1",
      },
      transformOrigin: {
        0: "0%",
      },
      boxShadow: {
        login: "0px 0px 10px 1px rgb(155 153 153 / 75%)",
      },
      colors: {
        "primary-light": "#F7F8FC",
        "secondary-light": "#FFFFFF",
        "ternary-light": "#f6f7f8",

        "primary-dark": "#0D2438",
        "secondary-dark": "#102D44",
        "ternary-dark": "#1E3851",
      },
      transitionProperty: {
        bg: "background-color",
      },
    },
  },
  plugins: [],
};
