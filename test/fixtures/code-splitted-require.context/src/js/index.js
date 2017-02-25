function getTemplate(templateName, callback) {
    require.ensure([], function (require) {
        callback(require('./mods/' + templateName)());
    });
}
getTemplate('a', function (a) {
    console.log(a);
});
getTemplate('b', function (b) {
    console.log(b);
});
