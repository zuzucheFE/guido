module.exports = function(options) {
    let name = options.hash.name || '';

    let strObject = {
        string: '',
        toHTML: function () {
            return this.string;
        }
    };
    if (name) {
        let newAttrs = [];
        if (options.hash.className !== undefined) {
            newAttrs.push(`class="${options.hash.className}"`);
        }

        for (let i in options.hash) {
            if (i !== 'name' && i !== 'className' && Object.prototype.hasOwnProperty.call(options.hash, i)) {
                newAttrs.push(`${i}="${options.hash[i]}"`);
            }
        }

        if (newAttrs.length) {
            newAttrs.unshift('');
        }

        newAttrs = newAttrs.join(' ');

        strObject.string = `<svg${newAttrs}><use xlink:href="#${name}"></use></svg>`;
    }

    return strObject;
};
