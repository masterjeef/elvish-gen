var webpack = require('webpack'),
    path = require('path');

module.exports = {
    debug: true,
    entry : "./index.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: "file-loader?name=fonts/[name].[ext]"},
            { test: /\.(png|jpg|gif)$/, loader: "file-loader?name=img/[name].[ext]"},
            { test: /\.(html)$/, loader: "file-loader?name=[name].[ext]"}
        ]
    },
    watch: true
};