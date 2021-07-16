module.exports = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, module: false }

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/billing',
        permanent: false,
      },
    ]
  },
}
