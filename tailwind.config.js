/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F5E8',
          100: '#C8E6C8',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#2E7D32',
          600: '#1B5E20',
          700: '#1B5E20',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        accent: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FB8C00',
          600: '#EF6C00',
          700: '#E65100',
          800: '#EF6C00',
          900: '#E65100',
        },
        surface: {
          50: '#FEFEFE',
          100: '#F2E9E4',
          200: '#F2E9E4',
          300: '#E8D5CE',
          400: '#DEC1B8',
          500: '#F2E9E4',
          600: '#C4A99E',
          700: '#A08A7F',
          800: '#7C6660',
          900: '#584241',
        },
        base: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};