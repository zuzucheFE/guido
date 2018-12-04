/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/getCacheIdentifier.js

'use strict';

module.exports = function getCacheIdentifier(environment, packages) {
	let cacheIdentifier = environment === null ? '' : environment.toString();
	packages.forEach(function(packageName) {
		cacheIdentifier += `:${packageName}@`;
		try {
			cacheIdentifier += require(`${packageName}/package.json`).version;
		} catch (_) {
			// ignored
		}
	});
	return cacheIdentifier;
};
