/**
 * Tailwind CSS v4 runs as a PostCSS plugin. The stylesheet entry itself lives in
 * src/app/globals.css, which imports both Tailwind and the @konopskidev/ui styles.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
