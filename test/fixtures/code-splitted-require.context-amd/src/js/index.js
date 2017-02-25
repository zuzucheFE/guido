function getTemplate(templateName, callback) {
    require(['./mods/' + templateName], function (mods) {
        callback(mods());
    });
}
getTemplate('a', function (a) {
    console.log(a);
});
getTemplate('b', function (b) {
    console.log(b);
});
