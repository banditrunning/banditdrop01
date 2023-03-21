const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ogg|mp4|wav|mpe?g)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/sounds",
            outputPath: "static/sounds",
            name: "[name]-[hash].[ext]",
            esModule: false,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
