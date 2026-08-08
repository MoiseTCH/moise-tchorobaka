/** @type {import('tailwindcss').Config} */
//
// Stage 2 note: the original 13-stage plan listed Global Styles, Fonts, and
// Theme System as three separate stages. Per the project owner's explicit
// Stage 2 instructions, this build treats all three as one combined "Global
// Design System" stage — documented here rather than silently reorganized.
// Header, Footer, and every page remain unbuilt, as instructed.
//
// Every value below reads from the CSS custom properties defined in
// src/styles/tokens.css rather than repeating hardcoded hex/px values here.
// This keeps exactly one source of truth: change a token once in tokens.css
// and both plain CSS classes (global.css) and Tailwind utility classes stay
// in sync automatically.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    // Custom breakpoints replace Tailwind's defaults to match the approved
    // design system exactly: mobile <600px, tablet 600-1023px,
    // desktop 1024-1439px, large desktop 1440px+.
    screens: {
      sm: '600px',
      md: '1024px',
      lg: '1440px',
    },
    extend: {
      colors: {
        'ink-navy': 'var(--color-ink-navy)',
        paper: 'var(--color-paper)',
        cobalt: 'var(--color-cobalt)',
        marigold: 'var(--color-marigold)',
        graphite: 'var(--color-graphite)',
        mist: 'var(--color-mist)',
        cloud: 'var(--color-cloud)',
        teal: 'var(--color-teal)',
        clay: 'var(--color-clay)',
      },
      fontFamily: {
        display: ['Source Serif 4', 'Georgia', 'Times New Roman', 'serif'],
        body: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontSize: {
        h1: 'var(--text-h1)',
        h2: 'var(--text-h2)',
        h3: 'var(--text-h3)',
        h4: 'var(--text-h4)',
        'body-lg': 'var(--text-body-lg)',
        body: 'var(--text-body)',
        'body-sm': 'var(--text-body-sm)',
        mono: 'var(--text-mono)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
      },
      boxShadow: {
        hover: 'var(--shadow-hover)',
      },
      transitionDuration: {
        base: '150ms',
      },
    },
  },
  plugins: [],
};
