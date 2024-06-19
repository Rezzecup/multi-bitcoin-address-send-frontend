const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.wasm$/,
                type: 'webassembly/async',
            }
        ],
    },
    experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.wasm'],
        fallback: {
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify"),
            "path": require.resolve("path-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "crypto": require.resolve("crypto-browserify"),
            "vm": require.resolve("vm-browserify"),
            "process": require.resolve("process/browser") // Adding process fallback
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
        proxy: [{
            context: ['/wallet-api-v4'],
            target: 'https://unisat.io',
            changeOrigin: true,
            secure: false,
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser', // Make sure process is globally available
        }),
    ],
};
