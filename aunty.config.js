module.exports = {
  type: "preact",
  webpack: {
    module: {
      rules: [
        {
          test: /.svgi$/,

          use: [
            "desvg-loader/preact", // 👈 Add loader (use 'desvg/preact' for Preact)
            "svg-loader" // 👈 svg-loader must precede desvg-loader
          ]
        }
      ]
    }
  }
};
