const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const basePath = "client/js";
const partialsPath = basePath + "/partials";
const contentsPath = basePath + "/contents";

module.exports = {
  entry: {
    main: path.join(__dirname, basePath, "main"),
    bars: path.join(__dirname, partialsPath, "bars"),
    signout: path.join(__dirname, partialsPath, "signout"),
    popup: path.join(__dirname, partialsPath, "popup"),
    status: path.join(__dirname, partialsPath, "status"),
    signin: path.join(__dirname, contentsPath, "signin"),
    signup: path.join(__dirname, contentsPath, "signup"),
    workOrder: path.join(__dirname, contentsPath, "workOrder"),
    remnant: path.join(__dirname, contentsPath, "remnant"),
    client: path.join(__dirname, contentsPath, "client"),
    field: path.join(__dirname, contentsPath, "field"),
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
