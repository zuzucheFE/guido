module.exports = {
    mode: 'development',

    entry: {
        'index-1': './src/js/index-1.js',
        'index-2': './src/js/index-2.js'
    },
    output: {
        publicPath: 'https://cdn.example.com/assets/'
    }
};
