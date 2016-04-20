var path = require('path');

module.exports = {
  cache: true,
  context: path.join(__dirname, ""),
  entry: ["./index.jsx"],
  output: {
    filename: "./build/bundle.js",
    sourceMapFilename: "./build/bundle.map"
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        loader: 'jsx-loader?insertPragma=React.DOM&harmony',
        test: /\.jsx$/
      },
      {
        loader: 'babel',
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      },
      {
        loader: "style!css!less",
        test: /\.less$/
      },
      {
        loader: "file-loader?name=assets/imgs/img-[hash:6].[ext]",
        test: /\.(png|jpg|gif)$/
      }
    ]
  },
  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'React'
  },
  resolve: {
    root: path.resolve('./client'),
    extensions: ['', '.js', '.jsx']
  }
}
