import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf5f1',
          100: '#fbe8df',
          200: '#f6cfc0',
          300: '#eeab95',
          400: '#e18067',
          500: '#c95d49',
          600: '#a94536',
          700: '#87372c',
          800: '#6f3029',
          900: '#5c2b26'
        },
        ink: {
          50: '#faf7f3',
          100: '#f1e9e0',
          200: '#ded0c2',
          300: '#bea898',
          400: '#987d6c',
          500: '#7a5f50',
          600: '#624b3f',
          700: '#4d3a31',
          800: '#392b25',
          900: '#271d1a'
        },
        paper: '#fbf7f0',
        blush: '#ebd2cb'
      },
      fontFamily: {
        display: ['Georgia', '"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        card: '0 18px 50px -30px rgba(72, 45, 34, 0.35)',
        paper: '0 24px 70px -38px rgba(72, 45, 34, 0.5)'
      }
    }
  },
  plugins: []
} satisfies Config;
