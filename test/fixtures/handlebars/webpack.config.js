module.exports = {
    entry: {
        index: './src/js/index.js'
    },

    externals: [{
        'handlebars/runtime': {
            root: 'window.handlebars',
            var: 'window.handlebars',
            commonjs2: 'handlebars',
            commonjs: 'handlebars',
            amd: 'handlebars',
            umd: 'handlebars'
        },

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
