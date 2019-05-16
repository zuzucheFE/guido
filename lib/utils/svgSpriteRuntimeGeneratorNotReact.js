'use strict';

const path = require('path');
const stringifyRequest = require('loader-utils').stringifyRequest;

const stringify = require('svg-sprite-loader/lib/utils/stringify.js');
const generateImport = require('svg-sprite-loader/lib/utils/generate-import.js');
const generateExport = require('svg-sprite-loader/lib/utils/generate-export.js');
const generateSpritePlaceholder = require('svg-sprite-loader/lib/utils/generate-sprite-placeholder.js');

function stringifySymbol(symbol) {
	let content = symbol.render().replace(/id="(.*)--sprite-notrc"/, 'id="$1"');
	return stringify({
		id: symbol.id.replace('--sprite-notrc', ''),
		use: symbol.useId.replace('--sprite-notrc', ''),
		viewBox: symbol.viewBox,
		content: content,
	});
}

module.exports = function runtimeGenerator(params) {
	const { symbol, config, context, loaderContext } = params;
	const {
		extract,
		esModule,
		spriteModule,
		symbolModule,
		runtimeCompat,
		publicPath,
	} = config;

	let runtime;
	let symbolId = symbol.id.replace('--sprite-notrc', '');

	if (extract) {
		const spritePlaceholder = generateSpritePlaceholder(
			symbol.request.file
		);
		const publicPath = stringify(publicPath) || '__webpack_public_path__';

		const viewBoxParts = symbol.viewBox.split(' ');
		const width = parseInt(viewBoxParts[2], 10);
		const height = parseInt(viewBoxParts[3], 10);

		const data = `{
            id: ${stringify(symbolId)},
            viewBox: ${stringify(symbol.viewBox)},
            url: ${publicPath} + ${stringify(spritePlaceholder)},
            width: ${width},
            height: ${height},
            toString: function () {
                return this.url;
            }
        }`;

		runtime = generateExport(data, esModule);
	} else {
		const spriteModuleAbsPath = path.isAbsolute(spriteModule)
			? spriteModule
			: path.join(context, spriteModule);
		const symbolModuleAbsPath = path.isAbsolute(symbolModule)
			? symbolModule
			: path.join(context, symbolModule);

		const spriteModuleImport = stringifyRequest(
			loaderContext,
			spriteModuleAbsPath
		);
		const symbolModuleImport = stringifyRequest(
			loaderContext,
			symbolModuleAbsPath
		);

		runtime = [
			generateImport('SpriteSymbol', symbolModuleImport, esModule),
			generateImport('sprite', spriteModuleImport, esModule),

			`let symbol = new SpriteSymbol(${stringifySymbol(symbol)})`,
			'sprite.add(symbol)',
		];

		if (runtimeCompat) {
			runtime.push(`export let symbolData = "#${symbolId}"`);
		} else {
			runtime.push(`export let symbolData = symbol`);
		}

		runtime = runtime.join(';\n');
	}

	return runtime;
};
