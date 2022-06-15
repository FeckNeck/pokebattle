module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#1a1a1a",
      },
      zIndex: {
        "-1": "-1",
      },
      transformOrigin: {
        0: "0%",
      },
      boxShadow: {
        login: "0px 0px 10px 1px rgb(155 153 153 / 75%)",
      },
      translate: {
        up: "0.25em",
      },
    },
  },
  plugins: [],
};
