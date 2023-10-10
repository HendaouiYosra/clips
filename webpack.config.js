module.exports = {
  // ... other webpack configuration options

  module: {
    rules: [
      // Add a rule to handle CSS files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/
      },
      // ... other rules for different file types if needed
    ],
  },
};
