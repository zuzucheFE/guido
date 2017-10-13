module.exports = {
    entry: {
        www: './src/www/page/www.js'
    },

    output: {
        publicPath: '//localhsot/static/'
    },

    externals: [{
        'jquery': {
            root: 'window.jQuery',
            var: 'window.jQuery',
            commonjs2: 'jquery',
            commonjs: 'jquery',
            amd: 'jquery',
            umd: 'jquery'
        }
    }]
};
