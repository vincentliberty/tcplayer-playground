module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.html$/,
            use: 'raw-loader'
          }
        ]
      }
    }
  }
};