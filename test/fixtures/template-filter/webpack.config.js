module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    html: {
        filter: function (path) {
            return /tpl(?:1|3)\.view\.handlebars/.test(path);
        }
    }
};
