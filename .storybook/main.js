const path = require('path')

module.exports = {
  stories: ['../components/**/stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules.push(path.resolve(__dirname, '..'))
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emotion/core': '@emotion/react',
      '@emotion/styled': '@emotion/styled',
      'emotion-theming': '@emotion/react',
    }

    return config
  },
}
