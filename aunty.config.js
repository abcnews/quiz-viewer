const webpack = require("webpack");
module.exports = {
  type: "preact",
  webpack: config => {
    config.module.rules.push({
      test: /.svgi$/,

      use: [
        "desvg-loader/preact", // 👈 Add loader (use 'desvg/preact' for Preact)
        "svg-loader" // 👈 svg-loader must precede desvg-loader
      ]
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        FB_API_KEY: JSON.stringify(process.env.FB_API_KEY),
        FB_AUTH_DOMAIN: JSON.stringify(process.env.FB_AUTH_DOMAIN),
        FB_DATABASE_URL: JSON.stringify(process.env.FB_DATABASE_URL),
        FB_PROJECT_ID: JSON.stringify(process.env.FB_PROJECT_ID),
        FB_STORAGE_BUCKET: JSON.stringify(process.env.FB_STORAGE_BUCKET),
        FB_MESSAGE_SENDER_ID: JSON.stringify(process.env.FB_MESSAGE_SENDER_ID)
      })
    );
    return config;
  }
};
