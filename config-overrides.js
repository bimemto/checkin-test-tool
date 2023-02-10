const { override, addWebpackAlias } = require("customize-cra");
const addLessLoader = require("customize-cra-less-loader");
const path = require("path");

module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
  }),
  addWebpackAlias({
    "@components": path.resolve(__dirname, "./src/components"),
    "@api": path.resolve(__dirname, "./src/api"),
    "@app": path.resolve(__dirname, "./src/app"),
    "@hooks": path.resolve(__dirname, "./src/hooks"),
    "@styles": path.resolve(__dirname, "./src/styles"),
    "@utils": path.resolve(__dirname, "./src/utils"),
    "@assets": path.resolve(__dirname, "./src/assets"),
    "@views": path.resolve(__dirname, "./src/views"),
    "@types": path.resolve(__dirname, "./src/types"),
  })
);