module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000', // Preto absoluto para header e elementos principais
        },
        accent: {
          DEFAULT: '#fed801', // Amarelo vibrante
        },
        background: {
          DEFAULT: '#FFFFFF', // Fundo branco
        },
        foreground: {
          DEFAULT: '#000000', // Texto principal preto
        },
        muted: {
          DEFAULT: '#F3F4F6', // Cinza claro para divisores, etc
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem', // 8px
        md: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0,0,0,0.08)',
        button: '0 1px 3px 0 rgba(254, 216, 1, 0.15)',
      },
      transitionProperty: {
        DEFAULT: 'all',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
