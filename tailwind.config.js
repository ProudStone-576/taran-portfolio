/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070A',
        bone: '#E8EDE7',
        acid: '#39FF7A',
        plasma: '#FF3D7F',
        cobalt: '#3D5BFF',
        amber: '#FFB23D',
        danger: '#FF4242',
        rack: '#0E141A',
        copper: '#FFA552',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'scroll-hint': 'scroll-hint 1.8s ease-in-out infinite',
        'flicker': 'flicker 4s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'scanline': 'scanline 6s linear infinite',
        'led-blink': 'led-blink 1.4s steps(2, end) infinite',
        'led-pulse': 'led-pulse 2s ease-in-out infinite',
        'rack-fan': 'rack-fan 1.6s linear infinite',
        'data-pulse': 'data-pulse 1.4s ease-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-hint': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50.1%, 53%': { opacity: '0.4' },
          '51%': { opacity: '0.9' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'led-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.15' },
        },
        'led-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(57,255,122,0.6)' },
          '50%': { boxShadow: '0 0 0 8px rgba(57,255,122,0)' },
        },
        'rack-fan': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'data-pulse': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
