/* Current Path */
const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");

/* Vue Loader */
const { VueLoaderPlugin } = require('vue-loader')

/* HTML Template */
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpack = require('webpack')

module.exports = {
    /* Build Type */
    mode: 'development',
    /* Entry Point */
    entry: {
        main: path.resolve(__dirname, 'src/main.js')
    },
    /* Output Config */
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        assetModuleFilename: '[name][ext]',
    },
    /* Source Map for Error Debug */
    devtool: 'source-map',
    /* Webpack Server Config */
    devServer: {
        static: {
           directory: path.resolve(__dirname, 'dist') 
        },
        port: 3000,
        open: false,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
         /* Images Loader */
        {
            test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
            type: 'asset/resource',
        },
         /* Style Sheet Loader*/
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        // Vue Loader
        {
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue-loader'
        },
        ]
    },
    plugins: [
        /* Automated HTML Generation */
        new HtmlWebpackPlugin({
            favicon: "./src/favicon.ico",
            title: 'Webpack App',
            filename: 'index.html',
            template: "./src/template.html",
        }),
        /* Copy Plugin */
        new CopyPlugin({
            patterns: [
                { 
                    from: path.resolve(__dirname, 'src/assets/models'), 
                    to: path.resolve(__dirname, 'dist/models/') 
                },
            ]
        }),
        // add vue-loader plugin
        new VueLoaderPlugin(),
        /**
         * to remove warn in browser console: runtime-core.esm-bundler.js:3607 
         * Feature flags __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__ are not explicitly defined..
         */
        new webpack.DefinePlugin({ __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: true }),
        
    ]
}