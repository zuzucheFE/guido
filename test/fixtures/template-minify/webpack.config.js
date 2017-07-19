module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    html: function(HtmlWebpackPluginConfig) {
        HtmlWebpackPluginConfig.minify = {
            html5: true,
            collapseWhitespace: true
        };
        return HtmlWebpackPluginConfig;
    }
};
