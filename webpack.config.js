// require our dependencies
const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = [
{
  name: 'site',
  // the base directory (absolute path) for resolving the entry option
  context: __dirname,
  node: false,
  // the entry point we created earlier. Note that './' means 
  // your current directory. You don't have to specify the extension  now,
  // because you will specify extensions later in the `resolve` section
  entry: {
    main: './frontend/src/index'
  },
  
  output: {
    // where you want your compiled bundle to be stored
    path: path.resolve('./frontend/bundles/'), 
    // naming convention webpack should use for your files
    filename: '[name]-[hash].js' 
  },
  
  plugins: [
    // tells webpack where to store data about your bundles
    new BundleTracker({filename: './webpack-stats.json'}),
    // makes jQuery available in every module
    new webpack.ProvidePlugin({ 
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery' 
    }),
    new CleanWebpackPlugin(['bundles'], {
      root: path.resolve('./frontend/')
    })
  ],
  
  module: {
    rules: [
      // a regexp that tells webpack use the following loaders on all 
      // .js and .jsx files
      {
        test: /\.jsx?$/, 
        // we definitely don't want babel to transpile all the files in 
        // node_modules. That would take a long time.
        exclude: /node_modules/, 
        // use the babel loader 
        loader: 'babel-loader', 
        query: {
          // specify that we will be dealing with React code
          presets: ['react', 'babel-preset-env'] 
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  
  resolve: {
    // tells webpack where to look for modules
    modules: ['node_modules'],
    // extensions that should be used to resolve modules
    extensions: ['.js', '.jsx'] 
  }   
},
{
  name: 'browser',
  context: path.resolve(__dirname, 'browser'),
  node: false,
  entry: {
    background: './src/js/background',
    bandcamp: './src/js/bandcamp',
    content: './src/js/content',
    player: './src/js/player'
  },
  output: {
    path: path.resolve('./browser/dist/'),
    filename: 'js/[name].js'
  },

  plugins: [
    new BundleTracker({filename: './browser-stats.json'}),
    new CopyWebpackPlugin([
      {from: './src/manifest.json'},
      {from: './src/media', to: 'media'},
      {from: './src/css', to: 'css'},
      {from: './src/html', to: 'html'}
    ])
  ],

  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['babel-preset-env']
        }
      }
    ]
  }
}];
