/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'border-width': 'border-width 3s infinite linear',
      },
      keyframes: {
        'border-width': {
          '0%, 100%': { 'border-width': '2px' },
          '50%': { 'border-width': '8px' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      backgroundImage: {
        'binary-gradient': 'linear-gradient(90deg, #000000 0%, #00ff00 50%, #000000 100%)',
        'binary-gradient-45': 'linear-gradient(45deg, #000000 0%, #00ff00 50%, #000000 100%)',
        'binary-gradient-radial': 'radial-gradient(circle, #00ff00 0%, #000000 70%)',
        'binary-pulse': 'linear-gradient(90deg, #000000, #00ff00, #000000)',
        'genz-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'genz-gradient-2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'genz-gradient-3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'genz-gradient-4': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3)',
        'glow-lg': '0 0 15px rgba(0, 255, 0, 0.7), 0 0 30px rgba(0, 255, 0, 0.4)',
        'glow-primary': '0 0 10px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3)',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light", 
      "dark", 
      "cupcake",
      {
        genz: {
          "primary": "#7e22ce",
          "primary-focus": "#6b21a8",
          "primary-content": "#ffffff",
          "secondary": "#0d9488",
          "secondary-focus": "#115e59",
          "secondary-content": "#ffffff",
          "accent": "#d946ef",
          "accent-focus": "#c026d3",
          "accent-content": "#ffffff",
          "neutral": "#171717",
          "neutral-focus": "#262626",
          "neutral-content": "#ffffff",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f1f5f9",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        ysearch: {
          "primary": "#ff6b6b",
          "secondary": "#f0e68c",
          "accent": "#ffb8b8",
          "neutral": "#2a2a2a",
          "base-100": "#1a1a1a",
          "info": "#93c5fd",
          "success": "#bbf7d0",
          "warning": "#fde68a",
          "error": "#fca5a5",
        },
      }
    ],
  },
}