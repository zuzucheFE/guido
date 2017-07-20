module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    html: {
        beforeInitialization: function (HtmlWebpackPluginConfig) {
            HtmlWebpackPluginConfig.minify = {
                html5: true,
                collapseWhitespace: true
            };
        }
    }
};
