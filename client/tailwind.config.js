/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14b8a6', // Teal primary accent
          light: '#ccfbf1',
          dark: '#0f766e',
        },
        expense: {
          DEFAULT: '#f97316', // Orange expense accent
          light: '#ffedd5',
          dark: '#c2410c',
        },
        savings: {
          DEFAULT: '#3b82f6', // Blue savings accent
          light: '#dbeafe',
          dark: '#1d4ed8',
        },
        customBg: '#f7f8fa', // Soft light gray background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px', // Rounded 16px cards
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(148, 163, 184, 0.08), 0 2px 8px -1px rgba(148, 163, 184, 0.04)',
        'premium-hover': '0 10px 25px -3px rgba(148, 163, 184, 0.14), 0 4px 12px -2px rgba(148, 163, 184, 0.06)',
      }
    },
  },
  plugins: [],
}
