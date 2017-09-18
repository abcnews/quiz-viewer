module.exports = {
  type: 'preact-app',
  babel: {
    presets: [
      {
        plugins: [
          [require.resolve('babel-plugin-transform-object-rest-spread')]
        ]
      }
    ]
  },
  webpack: {
    module: {
      rules: [
        {
          test: /.svgi$/,

          use: [
            'desvg-loader/preact', // 👈 Add loader (use 'desvg/preact' for Preact)
            'svg-loader' // 👈 svg-loader must precede desvg-loader
          ]
        }
      ]
    }
  }
};
