const path = require('path');
// 1. NOVÉ: Načteme plugin
const Dotenv = require('dotenv-webpack'); 

module.exports = {
  entry: './src/index.ts',
  // ... (tvoje nastavení module, resolve, atd. zůstává stejné) ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new Dotenv()
  ],
  
  mode: 'development'
};