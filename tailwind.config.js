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
          DEFAULT: '#FF6B35',
          dark: '#E55A2B',
          light: '#FF8557',
        },
        secondary: {
          DEFAULT: '#004E89',
          dark: '#003A66',
          light: '#1A6AAC',
        },
        accent: {
          DEFAULT: '#F7B801',
          dark: '#D49D00',
          light: '#FFCA28',
        },
        success: {
          DEFAULT: '#06D6A0',
          dark: '#05B589',
          light: '#2BDFB0',
        },
        danger: {
          DEFAULT: '#EF476F',
          dark: '#D93A5F',
          light: '#F26B8E',
        },
        background: {
          dark: '#0A1628',
          medium: '#162840',
          light: '#1E3A5F',
        },
        text: {
          light: '#E8F1F5',
          medium: '#B8D4E3',
          dark: '#8BA3B5',
        },
        border: '#2A4A6E',
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
