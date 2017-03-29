import objectMerge from './object-assign';
console.log(objectMerge({code: 0}, { msg: 'wow!'}));

import combineDefaultParam from './combine-default-param';
console.log(CombineDefaultParam({
    bar: 'yay'
}));

import Child from './class-extends';
const child = new Child();

import promise from './promise';
promise(true).then(result => console.log(result)).catch(error => console.log(error));

import Say from './say';
Say();
