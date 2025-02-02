const colors = require('./src/components/ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: false,
  // darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
        'dm-sans-regular': ['dm-sans-regular'],
        'dm-sans-medium': ['dm-sans-medium'],
        'dm-sans-bold': ['dm-sans-bold'],
      },
      colors,
    },
  },
  plugins: [],
};
