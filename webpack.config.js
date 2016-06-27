var webpack = require('webpack'),
    ProvidePlugin = require('webpack/lib/ProvidePlugin'),
    path = require('path');

module.exports = {
    debug: true,
    entry : "./index",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    devServer: {
      contentBase: '/dist/'
    },
    plugins: [
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new ProvidePlugin({
            transcriber: './tengwar-transcriber',
            'window.transcriber': './tengwar-transcriber'
        })
    ],
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
                test: /\.(eot|svg|ttf|png|jpg|gif)$/,
                loader: "url-loader?limit=10000",
                exclude: /node_modules/
            },
            {
                test: /\.(html)$/,
                loader: "file-loader?name=[name].[ext]",
                exclude: /node_modules/
            },
            {
                test: /\.(woff)/,
                loader: "url?limit=10000&mimetype=application/font-woff",
                exclude: /node_modules/
            },
            {
                test: /\.(woff2)/,
                loader: "url?limit=10000&mimetype=application/font-woff2",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    watch: true
};