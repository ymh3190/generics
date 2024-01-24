const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "client/js", "main"),
    bars: path.join(__dirname, "client/js", "bars"),
    state: path.join(__dirname, "client/js", "state"),
    signout: path.join(__dirname, "client/js", "signout"),
    signin: path.join(__dirname, "client/js", "signin"),
    signup: path.join(__dirname, "client/js", "signup"),
    watch: path.join(__dirname, "client/js", "watch"),
    place: path.join(__dirname, "client/js", "place"),
    popup: path.join(__dirname, "client/js", "popup"),
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
