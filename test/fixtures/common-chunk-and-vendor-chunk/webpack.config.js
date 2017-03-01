const webpack = require('../../../lib/guido').webpack;

module.exports = {
    entry: {
        vendor: ['./src/js/vendor1', './src/js/vendor2'],
        pageA: './src/js/pageA',
        pageB: './src/js/pageB',
        pageC: './src/js/pageC'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['common', 'vendor'],
            minChunks: 2
        })
    ]
};
