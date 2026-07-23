/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      // ─── Brand Colors ───────────────────────────────────────────────────────
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // primary
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef', // accent
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        surface: {
          DEFAULT: '#0f172a', // dark surface
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error:   '#ef4444',
        info:    '#3b82f6',
      },

      // ─── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },

      // ─── Spacing ─────────────────────────────────────────────────────────────
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },

      // ─── Border radius ────────────────────────────────────────────────────────
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // ─── Box shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.4)',
        card: '0 4px 24px rgba(0, 0, 0, 0.12)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.5)',
      },

      // ─── Animation ───────────────────────────────────────────────────────────
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      // ─── Screens ─────────────────────────────────────────────────────────────
      screens: {
        xs: '480px',
      },
    },
  },

  plugins: [],
};
