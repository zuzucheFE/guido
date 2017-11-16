module.exports = function(options) {
    var name = options.hash.name || '';

    var strObject = {
        string: '',
        toHTML: function () {
            return this.string;
        }
    };
    if (name) {
        var newAttrs = [];
        if (options.hash.className !== undefined) {
            newAttrs.push('class="' + options.hash.className + '"');
        }

        for (var i in options.hash) {
            if (i !== 'name' && i !== 'className' && Object.prototype.hasOwnProperty.call(options.hash, i)) {
                newAttrs.push(i + '="' + options.hash[i] + '"');
            }
        }

        if (newAttrs.length) {
            newAttrs.unshift('');
        }

        newAttrs = newAttrs.join(' ');

        strObject.string = '<svg' + newAttrs + '><use xlink:href="#' + name + '"></use></svg>';
    }

    return strObject;
};
