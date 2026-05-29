/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  corePlugins: {
    // Désactive preflight pour ne pas interférer avec les styles inline existants
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        navy:   '#0F172A',
        cream:  '#FDFBF7',
        terra:  '#C2410C',
        'terra-light': '#FEF0E8',
        'terra-mid':   '#F97316',
        'ink':    '#1E293B',
        'ink-muted': '#64748B',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans:  ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'soft':  '0 2px 16px rgba(15,23,42,0.06)',
        'card':  '0 4px 24px rgba(15,23,42,0.08)',
        'lifted':'0 8px 40px rgba(15,23,42,0.12)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease both',
        'fade-in':    'fadeIn 0.4s ease both',
        'slide-msg':  'slideMsg 0.4s ease both',
        'progress':   'progress 12s linear forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideMsg: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        progress: { from: { width: '4%' }, to: { width: '95%' } },
      },
    },
  },
  plugins: [],
};
