module.exports = {
  // entry: {
  //   index: './index.jsx',
  //   lsd_slider: './scripts/LsdSlider.jsx',
  //   domready: './scripts/domready.js'
  // },
  entry: './index.jsx',
  output: {
    filename: 'bundle.js',
    publicPath: 'http://localhost:8090/build'
  },
  module: {
    loaders: [{
      //tell webpack to use jsx-loader for all *.jsx files
      test: /\.jsx$/,
      loader: 'jsx-loader?insertPragma=React.DOM&harmony'
    }]
  },
  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}