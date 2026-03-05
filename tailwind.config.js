/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg:      '#08001f',
          card:    '#120030',
          raised:  '#1a0040',
          border:  'rgba(37,211,102,0.15)',
          bright:  'rgba(37,211,102,0.3)',
          text:    '#c8d8e8',
          muted:   '#4a6070',
          dim:     '#2a3a48',
          green:   '#25D366',
          'green-dim': '#1a9e4a',
          purple:  '#bf5fff',
          pink:    '#ff2d6b',
        },
        warm: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f4ddb0',
          300: '#ecc77e',
          400: '#e3ac4c',
          500: '#d9922a',
          600: '#c07520',
          700: '#9f5c1c',
          800: '#824a1e',
          900: '#6b3d1c',
        },
        sage: {
          50:  '#f2f7f4',
          100: '#e0ece5',
          200: '#c2d9cc',
          300: '#97bfaa',
          400: '#669e83',
          500: '#468165',
          600: '#356751',
          700: '#2b5342',
          800: '#244336',
          900: '#1f382d',
        },
        clay: {
          50:  '#fdf5f3',
          100: '#fbe8e4',
          200: '#f8d4cc',
          300: '#f2b4a8',
          400: '#e8876f',
          500: '#da6348',
          600: '#c7482e',
          700: '#a83923',
          800: '#8b3121',
          900: '#742e22',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

