var webpack = require('webpack'),
    path = require('path');

module.exports = {
    debug: true,
    entry : "./index",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    devServer: {
      contentBase: 'dist'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                exclude: /node_modules/
            },
            {
                test:/\.scss$/,
                loader: "style-loader!css-loader!sass-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
                loader: "url-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(html)$/,
                loader: "file-loader?name=[name].[ext]",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    watch: true
};