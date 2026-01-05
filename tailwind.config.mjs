
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFA',
          100: '#FAF9F6',
          200: '#F5F3EF',
          300: '#E8E3DA',
          400: '#E5DFD5',
        },
        coral: {
          400: '#FF9B7F',
          500: '#FF7A59',
          600: '#F97316',
        },
        purple: {
          400: '#9B87C0',
          500: '#8B7FA8',
          600: '#7A6B94',
        },
        charcoal: {
          800: '#2D2D2D',
          900: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 40px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
