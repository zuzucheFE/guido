new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({status: 0});
    }, 2000);
}).then((res) => {
    console.log(res);
}).catch((error) => {
    console.log(error);
});
