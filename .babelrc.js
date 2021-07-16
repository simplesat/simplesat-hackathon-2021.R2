module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
          // uncomment the following 2 lines to use why-did-you-render
          // development: process.env.NODE_ENV === 'development',
          // importSource: '@welldone-software/why-did-you-render',
        },
      },
    ],
  ],
  plugins: ['@emotion/babel-plugin', 'babel-plugin-macros'],
}
