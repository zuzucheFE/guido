module.exports = {
    mode: 'development',

    entry: {
        index: './src/js/index.js'
    },

    browserslist: [
        'iOS >= 9', 'Android >= 4', 'last 2 ChromeAndroid versions'
    ],

    optimization: {
        occurrenceOrder: true
    }
};
