export default function promise(a) {
    return new Promise(function (resolve, reject) {
        a ? resolve(true) : reject(false);
    });
}
