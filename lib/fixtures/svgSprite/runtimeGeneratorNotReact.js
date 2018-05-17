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
        content: content
    });
}

module.exports = function runtimeGenerator({ symbol, config, context, loaderContext }) {
    const { extract, esModule, spriteModule, symbolModule, runtimeCompat } = config;

    let runtime;
    let symbolId = symbol.id.replace('--sprite-notrc', '');

    if (extract) {
        const spritePlaceholder = generateSpritePlaceholder(symbol.request.file);
        const publicPath = loaderContext._compiler.options.output.publicPath;

        const viewBoxParts = symbol.viewBox.split(' ');
        const width = parseInt(viewBoxParts[2], 10);
        const height = parseInt(viewBoxParts[3], 10);

        const data = `{
      id: ${stringify(symbolId)},
      viewBox: ${stringify(symbol.viewBox)},
      url: ${publicPath} + ${stringify(spritePlaceholder)},
      width: ${width},
      height: ${height}
    }`;

        runtime = generateExport(data, esModule);
    } else {
        const spriteModuleImport = stringifyRequest({ context }, spriteModule);
        const symbolModuleImport = stringifyRequest({ context }, symbolModule);

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
