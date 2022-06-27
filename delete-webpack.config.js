const path = require('path');
const yaml = require('yamljs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    console.log(env)
    return {
        // entry: './src/index.js',
        entry: {
            index: './src/index.js',
        },
        devtool: 'inline-source-map',
        plugins: [
            new HtmlWebpackPlugin({
                title: '标题',
            }),
        ],
        output: {
            // filename: 'bundle.js',
            // filename: '[name].bundle.js',
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'src'),
                    loader: 'babel-loader',
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],//css
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,//图片
                    type: 'asset/resource',
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
            ],
        },
        mode: 'development',
        devServer: {
            static: './dist',
            // hot: true, //默认就是启用的
        },
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
};