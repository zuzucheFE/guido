function getTemplate(templateName) {
    return require('./mods/'+templateName);
}
console.log(getTemplate('a'));
console.log(getTemplate('b'));
