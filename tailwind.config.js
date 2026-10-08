/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          100: '#F1F5F9',
          50: '#F8FAFC',
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 18px 36px -8px rgba(15, 23, 42, 0.07), 0 8px 16px -6px rgba(15, 23, 42, 0.03)',
        'preview': '0 24px 44px -12px rgba(15, 23, 42, 0.08), 0 6px 16px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
