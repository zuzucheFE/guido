import Parent from './class';

export default class Child extends Parent {
    constructor() {
        console.log('Child constructor');
        super();
    }
}
