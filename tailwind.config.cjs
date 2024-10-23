import {nextui} from "@nextui-org/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // single component styles
    "./node_modules/@nextui-org/theme/dist/components/button.js",
		"./node_modules/@nextui-org/theme/dist/components/card.js",
		"./node_modules/@nextui-org/theme/dist/components/slider.js",
		"./node_modules/@nextui-org/theme/dist/components/chip.js",
  ],
  themes: {
    light: {
      colors: {
        primary: "#0072f5",
      }
    },
    dark: {
      colors: {
        primary: "#0072f5",
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};