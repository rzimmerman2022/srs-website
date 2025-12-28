import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors derived from logo
        navy: {
          DEFAULT: '#1a2332',
          50: '#f0f1f3',
          100: '#d9dce2',
          200: '#b3b9c5',
          300: '#8d96a8',
          400: '#67738b',
          500: '#41506e',
          600: '#2f3d56',
          700: '#1a2332', // Main navy
          800: '#141a26',
          900: '#0d111a',
        },
        gold: {
          DEFAULT: '#d4af37',
          50: '#faf8ef',
          100: '#f4efd9',
          200: '#e9dfb3',
          300: '#ddce8d',
          400: '#d2be67',
          500: '#d4af37', // Main gold
          600: '#b8982a',
          700: '#8c741f',
          800: '#604f15',
          900: '#34290a',
        },
        sand: {
          DEFAULT: '#f5e6d3',
          50: '#fdfcf9',
          100: '#faf6f0',
          200: '#f5e6d3', // Main sand
          300: '#edd7b8',
          400: '#e5c89d',
          500: '#ddb982',
          600: '#d4aa67',
          700: '#b8904d',
          800: '#8c6c3a',
          900: '#604826',
        },
        charcoal: {
          DEFAULT: '#2d2d2d',
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#858585',
          500: '#666666',
          600: '#525252',
          700: '#3d3d3d',
          800: '#2d2d2d', // Main charcoal
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2d2d2d',
            a: {
              color: '#d4af37',
              '&:hover': {
                color: '#b8982a',
              },
            },
            // Ensure list styles are applied
            'ul': {
              listStyleType: 'disc',
              paddingLeft: '1.5em',
            },
            'ol': {
              listStyleType: 'decimal',
              paddingLeft: '1.5em',
            },
            'ul > li': {
              paddingLeft: '0.5em',
            },
            'ol > li': {
              paddingLeft: '0.5em',
            },
            'ul > li::marker': {
              color: '#d4af37',
            },
            'ol > li::marker': {
              color: '#d4af37',
              fontWeight: '600',
            },
          },
        },
        navy: {
          css: {
            '--tw-prose-body': '#2d2d2d',
            '--tw-prose-headings': '#1a2332',
            '--tw-prose-links': '#d4af37',
            '--tw-prose-bold': '#1a2332',
            '--tw-prose-bullets': '#d4af37',
            '--tw-prose-counters': '#d4af37',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export type { Config };

export default config;
