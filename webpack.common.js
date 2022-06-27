const path = require('path');
const webpack = require('webpack');
const yaml = require('yamljs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    // entry: './src/index.js',
    entry: {
        index: './src/index.js',
    },
    // devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Common',
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new webpack.ProvidePlugin({
            _: 'lodash',
        }),
    ],
    esolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        // filename: 'bundle.js',
        // filename: '[name].bundle.js',
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                // use: ['style-loader', 'css-loader'],//css
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,//图片
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,//字体
                type: 'asset/resource',
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
            },
            {
                test: /\.xml$/i,
                use: ['xml-loader'],
            },
            {
                test: /\.yaml$/i,//自定义 json 模块 parser
                type: 'json',
                parser: {
                    parse: yaml.parse,
                },
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
            },
        ],
    },
    // mode: 'development',
    // webpack.dev.js 中已经含有
    // devServer: {
    //     static: './dist',
    //     // hot: true, //默认就是启用的
    // },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        usedExports: true, // Tree Shaking 未引用模块
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
}