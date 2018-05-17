const stringifyRequest = require('loader-utils').stringifyRequest;
const pascalCase = require('pascalcase');

const stringify = require('svg-sprite-loader/lib/utils/stringify.js');
const generateImport = require('svg-sprite-loader/lib/utils/generate-import.js');
const generateExport = require('svg-sprite-loader/lib/utils/generate-export.js');
const generateSpritePlaceholder = require('svg-sprite-loader/lib/utils/generate-sprite-placeholder.js');

function stringifySymbol(symbol) {
    let content = symbol.render().replace(/id="(.*)--sprite"/, 'id="$1"');
    return stringify({
        id: symbol.id.replace('--sprite', ''),
        use: symbol.useId.replace('--sprite', ''),
        viewBox: symbol.viewBox,
        content: content
    });
}

module.exports = function runtimeGenerator({ symbol, config, context, loaderContext }) {
    const { extract, esModule, spriteModule, symbolModule, runtimeCompat } = config;

    let runtime;
    let symbolId = symbol.id.replace('--sprite', '');

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
            generateImport('React', 'react', esModule),

            `let symbol = new SpriteSymbol(${stringifySymbol(symbol)})`,
            'sprite.add(symbol)',
        ];

        let rcDisplayName = `${pascalCase(symbolId)}SpriteSymbolComponent`;
        runtime.push(
            `export default function ${rcDisplayName}(props) {
                let newProps = {};
                if (props.className !== undefined) {
                    newProps.className = props.className;
                }
                for (let i in props) {
                    if (i !== 'className' && Object.prototype.hasOwnProperty.call(props, i)) {
                        newProps[i] = props[i];
                    }
                }
                return React.createElement('svg',
                    newProps,
                    React.createElement('use', { xlinkHref: '#${symbolId}' })
                );
            }`
        );

        if (runtimeCompat) {
            runtime.push(`export let symbolData = "#${symbolId}"`);
        } else {
            runtime.push(`export let symbolData = symbol`);
        }

        runtime = runtime.join(';\n');
    }

    return runtime;
};
