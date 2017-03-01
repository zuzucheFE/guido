const webpack = require('../../../lib/guido').webpack;

module.exports = {
    entry: {
        index: './src/js/index.js',
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'index',
            async: true
        })
    ]
};
