export default function promise(a) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            a ? resolve(true) : reject(false);
        }, 500);
    });
}
