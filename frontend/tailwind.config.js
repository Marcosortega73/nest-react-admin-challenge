module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--brand-primary)',
          hover: 'var(--red-hover)',
          foreground: 'var(--primary-white)',
          active: 'var(--brand-active)',
        },
        background: {
          DEFAULT: 'var(--brand-background)',
          header: 'var(--brand-header-background)',
        },
        white: {
          DEFAULT: 'var(--primary-white)',
          hover: 'var(--white-hover)',
        },
        header: {
          background: 'var(--brand-header-background)', // bg-header-background
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Helvetica Neue', 'Nunito Sans', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
