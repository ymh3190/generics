const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "frontend/js", "main"),
    bars: path.join(__dirname, "frontend/js/header", "bars"),
    watch: path.join(__dirname, "frontend/js/contents", "watch"),
    signout: path.join(__dirname, "frontend/js/header", "signout"),
    signin: path.join(__dirname, "frontend/js/contents", "signin"),
    signup: path.join(__dirname, "frontend/js/contents", "signup"),
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "js/[name].js",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
