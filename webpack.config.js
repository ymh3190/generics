const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "frontend/js", "main"),
    mainsIndex: path.join(__dirname, "frontend/js/mains", "index"),
    mainsVideo: path.join(__dirname, "frontend/js/mains", "video"),
    mainsImage: path.join(__dirname, "frontend/js/mains", "image"),
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
