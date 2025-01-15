module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          'postcss-preset-env': {
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
            features: {
              'custom-properties': false,
            },
          },
          'cssnano': {
            preset: ['default', {
              discardComments: {
                removeAll: true,
              },
              normalizeWhitespace: false,
            }],
          },
        }
      : {}),
  },
};
