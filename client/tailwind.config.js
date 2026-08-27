/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brandYellow: '#EED202',
        brandYellowMuted: '#b8a202',
        brandYellowDim: '#8a7a01',
        brandYellowFaint: '#5c5101',
        charcoal: '#2d2d2d',
        charcoalMuted: '#555555',
        blackMuted: '#2b2600',
        blackDim: '#4a4100',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Baloo Bhaijaan 2"', 'sans-serif'],
        arabic: ['"Baloo Bhaijaan 2"', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'draw-line': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 1.5s ease-out forwards',
        'draw-line': 'draw-line 2s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}
