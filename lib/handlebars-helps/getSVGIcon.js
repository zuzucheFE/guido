const Handlebars = require('Handlebars/dist/handlebars.min.js');

module.exports = function(options) {
    let name = options.hash.name || '';

    let newAttrs = [];
    if (options.hash.className !== undefined) {
        newAttrs.push(`class="${options.hash.className}"`);
    }

    for (let i in options.hash) {
        if (i !== 'name' && i !== 'className' && Object.prototype.hasOwnProperty.call(options.hash, i)) {
            newAttrs.push(`${i}="${options.hash[i]}"`);
        }
    }

    if (newAttrs.length > 1) {
        newAttrs.unshift('');
    }

    newAttrs = newAttrs.join(' ');

    return name && new Handlebars.SafeString(`<svg${newAttrs}><use xlink:href="#${name}"></use></svg>`);
};
