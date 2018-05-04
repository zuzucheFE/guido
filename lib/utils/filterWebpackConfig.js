'use strict';

module.exports = function filterWebpackConfig(config) {
    // 移除无用的配置
    delete config.override;
    delete config.output.templateDir;
    delete config.output.jsDir;
    delete config.output.cssDir;
    delete config.output.imageDir;
    delete config.output.fontDir;
    delete config.browserslist;
    delete config.svg2font;
    delete config.html;
    delete config.imagemin;
    delete config.handlebarsHelperDirs;
    delete config.handlebarsPartialDirs;
    delete config.svgSprite;

    return config;
};
