// https://github.com/storybookjs/storybook/issues/13277#issuecomment-752121361
const path = require('path')
const toPath = (_path) => path.join(process.cwd(), _path)
module.exports = ({ config }) => {
  config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]
  // use @babel/preset-react for JSX and env (instead of staged presets)
  config.module.rules[0].use[0].options.presets = [
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-env'),
    require.resolve('@emotion/babel-preset-css-prop'),
  ]
  // ... other configs

  // Add Webpack rules for TypeScript
  // ========================================================
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        ['react-app', { flow: false, typescript: true }],
        require.resolve('@emotion/babel-preset-css-prop'),
      ],
      // ... other configs
    },
  })
  // ... other configs

  config.resolve.extensions.push('.ts', '.tsx')

  config.resolve.alias = {
    ...config.resolve.alias,
    '@emotion/core': toPath('node_modules/@emotion/react'),
    '@emotion/styled': toPath('node_modules/@emotion/styled'),
    'emotion-theming': toPath('node_modules/@emotion/react'),
  }

  // Fix absolute import not working
  // https://github.com/storybookjs/storybook/issues/11639#issuecomment-689835701
  config.resolve.modules = [...config.resolve.modules, path.resolve(__dirname, '..')]

  return config
}
