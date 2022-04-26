'use strict';

const postcss = require('postcss');

function strSplice(str, start, delCount, newSubStr) {
	return (
		str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount))
	);
}

module.exports = (opts = {}) => {
    // checkOpts(opts);
    return {
        postcssPlugin: 'postcss-discern-font-svg',
        Once (root, { result }) {
            root.walkAtRules('font-face', function(ruleItem) {
                ruleItem.walkDecls('src', function(decl) {
                    let searchValue = '.svg?';
                    let index = decl.value.indexOf(searchValue);
                    if (index > -1) {
                        decl.value = strSplice(
                            decl.value,
                            index + searchValue.length,
                            0,
                            '__font&'
                        );
                        return false;
                    } else {
                        searchValue = '.svg';
                        index = decl.value.indexOf(searchValue);
                        if (index > -1) {
                            decl.value = strSplice(
                                decl.value,
                                index + searchValue.length,
                                0,
                                '?__font'
                            );
                            return false;
                        }
                    }
                });
            });
        }
    };
}

module.exports.postcss = true;
