const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    output: {
        filename: 'main-bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            //{ test: /\.js$/, loader: "source-map-loader" },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    mode: 'development',
    // plugins: [
    //    new BundleAnalyzerPlugin()
    //],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 9000,
        compress: true
    }

}