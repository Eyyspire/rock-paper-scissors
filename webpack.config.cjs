const path = require('path');
const html = 'pfc'

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './client/scripts/main.js',
  target : 'node',
  mode : 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/bundle.js'
  },
  plugins: [

    new HtmlWebpackPlugin({
      template: `./client/html/${html}.html`,
      filename: `html/${html}.html`
        }),

    new CopyPlugin({
      patterns: [
      {
        from: 'client/html/*.html',
        to:   'html/[name].html',
        globOptions: {
          ignore: [`**/${html}.html`]
        },
        noErrorOnMissing : true
      },
      {
        from: 'client/images/*',
        to:   'images/[name][ext]',
        noErrorOnMissing : true
      },
      {
        from: 'client/style/*',
        to:   'style/[name][ext]',
        noErrorOnMissing : true
      },
          ]
      })
      ],

      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
                "style-loader",
                "css-loader"
            ]
          }
        ]
      }
    

};