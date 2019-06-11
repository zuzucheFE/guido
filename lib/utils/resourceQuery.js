'use strict';

module.exports = {
	isUrl: function isUrl(queryStr) {
		return queryStr === '?__url';
	},
	isInline: function isInline(queryStr) {
		return queryStr === '?__inline';
	},
};
