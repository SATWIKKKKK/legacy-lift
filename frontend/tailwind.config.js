export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        gray: {
          900: "#0a0a0a",
          800: "#121212",
          700: "#1a1a1a",
          600: "#2d2d2d",
          500: "#404040",
          400: "#737373",
          300: "#a3a3a3",
          200: "#d4d4d4",
        },
        green: {
          400: "#4ade80",
          500: "#22c55e",
        },
        blue: {
          400: "#60a5fa",
          500: "#3b82f6",
        },
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.2), 0 0 15px rgba(255, 255, 255, 0.2)',
          },
          '100%': {
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.4)',
          },
        },
        'border-glow': {
          '0%, 100%': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
          },
          '50%': {
            borderColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
  },
  plugins: [],
}
