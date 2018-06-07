module.exports = {
    mode: 'development',

    entry: {
        index: './src/js/index.js',
        'app-index': './src/js/app-index.js'
    },

    output: {
        publicPath: '../'
    },
    externals: {
        react: 'window.React',
        'react-dom': 'window.ReactDOM'
    }
};
