var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
var pathToReactDom = path.resolve(node_modules, 'react-dom/dist/react-dom.min.js');
var root = path.resolve(__dirname);
var minimize = process.argv.indexOf('--optimize-minimize') !== -1;

var setting = {
    plugins: [
    ],
    entry: {
        mathChart : './src/content/Main'
    },
    output: {
        path: 'public/wwwroot',
        filename: '[name].js'
    },
    module: {
       loaders: [
            {
              test: /\.js|jsx$/,
              exclude: /node_modules/,
              loader: 'babel',
              query:
                {
                  presets:['react']
                }
            },
            {
              test: /\.css$/,
              exclude: /node_modules/,
              loaders: ["style-loader", "css-loader"]
            },
            {
              test: /\.less$/,
              exclude: /node_modules/,
              loaders: ["style-loader", "css-loader", "less-loader"]
            },
            {
              test: /\.(png|jpg)$/,
              exclude: /node_modules/,
              loader: 'url-loader'
            },
            {
              test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
              exclude: /node_modules/,
              loader : 'file-loader?name=../style/[name].[ext]'
            }
        ],
        noParse: [pathToReact]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.scss'],
        alias:{
          'react': pathToReact,
          'react-dom': pathToReactDom,
          'BOWER': root+'/bower_components',
          'MODULE': root+'/src/js/module'
        }
    }
};

if (minimize) setting.entry = {
    'mathChart.min' : './src/content/Main'
}
module.exports = setting;
