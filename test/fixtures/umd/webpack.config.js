module.exports = {
    entry: {
        'index': './src/js/index.js'
    },
    output: {
        library: 'UMD',
        libraryTarget: 'umd',
        libraryExport: 'default',
        filename: '[name].js',
    }
};
