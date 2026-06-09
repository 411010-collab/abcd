/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './app.js',
  ],
  theme: {
    extend: {
      colors: {
        // 暗黑風背景
        'dark-bg': '#0d1117',
        'dark-bg-secondary': '#161b22',
        'dark-card': '#1c2128',
        'dark-card-hover': '#262c36',
        
        // 高質感強調色
        'accent-blue': '#58a6ff',
        'accent-purple': '#a371f7',
        'accent-pink': '#ff7b72',
        'accent-cyan': '#79c0ff',
        
        // 文字色
        'dark-text-primary': '#e6edf3',
        'dark-text-secondary': '#8b949e',
        'dark-text-muted': '#6e7681',
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
        'dark-card-gradient': 'linear-gradient(135deg, #1c2128 0%, #262c36 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(88, 166, 255, 0.15), 0 8px 16px rgba(0, 0, 0, 0.3)',
        'glow-purple': '0 0 20px rgba(163, 113, 247, 0.15), 0 8px 16px rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 8px 24px rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
