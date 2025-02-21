module.exports = {
  presets: [
    "module:metro-react-native-babel-preset",
    "babel-preset-expo",
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        safe: true,
        allowUndefined: false,
      },
    ],
  ],
};
