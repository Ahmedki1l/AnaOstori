/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	  "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
	  require('tailwind-scrollbar')({ nocompatible: true }),
  ],
  variants: {
	  scrollbar: ['rounded']
  },
  corePlugins: {
    preflight: false
  },
}
