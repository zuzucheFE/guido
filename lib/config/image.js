"use strict";

module.exports = function (options) {
    options || (options = {});

    return {
        pngquant:{
            quality: '65-90',
            speed: 4
        },
        svgo:{
            plugins: [{
                removeViewBox: false
            }, {
                removeEmptyAttrs: false
            }]
        }
    };
};
