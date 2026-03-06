/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#060708',
        bg2: '#0c0e12',
        border: '#1c2030',
        accent: '#c4a040',
        olive: '#3d4f3a',
        'olive-l': '#587050',
        text: '#849098',
        'text-b': '#c0ccd4',
        white: '#e4eaf0',
        danger: '#922020',
        blue: '#2a7a9a',
      },
      fontFamily: {
        bebas: ['BebasNeue'],
        mono: ['ShareTechMono'],
        barlow: ['BarlowCondensed-Regular'],
        'barlow-medium': ['BarlowCondensed-Medium'],
        'barlow-bold': ['BarlowCondensed-Bold'],
      },
    },
  },
  plugins: [],
};
