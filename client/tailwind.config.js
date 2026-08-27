/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brandYellow: '#fabb3c',
        brandYellowMuted: '#b58c2a',
        brandYellowDim: '#8c6b20',
        brandYellowFaint: '#5e4815',
        charcoal: '#2d2d2d',
        charcoalMuted: '#555555',
        blackMuted: '#32250c',
        blackDim: '#644b18',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
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
