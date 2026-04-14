/* eslint-disable */

module.exports = {
  presets: [
    ["@babel/preset-env"],
  ],
  plugins: [
    ["import", {
      "style": false,
      "libraryName": "antd"
    }]
  ]
};