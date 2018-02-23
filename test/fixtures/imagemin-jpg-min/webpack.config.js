module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        filename: '[name].js'
    },
    imagemin: {
        mozjpeg: {
            enabled: true,
            quality: 75
        }
    }
};
