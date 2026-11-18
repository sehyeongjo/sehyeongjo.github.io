const path = require('path');
const pkg = require('./package');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

// Relative './' is for the GitHub Pages build; the dev server 404s assets with it.
const publicPath = process.argv.includes('--serve') ? '/' : './';

module.exports = (options, req) => ({
  entry: [
    'src/polyfills.js',
    'src/index.js',
  ],
  output: {
    html: {
      title: pkg.productName,
      template: path.join(__dirname, 'index.ejs'),
	  description: pkg.description,
      publicPath: './',
    },
  	publicUrl: publicPath,
  },
  chainWebpack(config) {
    config.output.publicPath(publicPath);
    // optionally `return config`
	config
      .plugin('preload-webpack')
      .use(PreloadWebpackPlugin)
      .end()
  },

  // or object
  // merged using `webpack-merge` module
  configureWebpack: {
  },
  plugins: [
//  new PreloadWebpackPlugin({
//    rel: 'preload',
//    include: 'allChunks' // or 'initial', or 'allAssets'
//  })
  ]
});
