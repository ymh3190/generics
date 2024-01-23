const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "client/js", "main"),
    bars: path.join(__dirname, "client/js/partials", "bars"),
    state: path.join(__dirname, "client/js/partials", "state"),
    signout: path.join(__dirname, "client/js/partials", "signout"),
    signin: path.join(__dirname, "client/js/contents", "signin"),
    signup: path.join(__dirname, "client/js/contents", "signup"),
    watch: path.join(__dirname, "client/js/contents", "watch"),
    place: path.join(__dirname, "client/js/contents", "place"),
  },
  output: {
    path: path.resolve(__dirname, "./public"),
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
