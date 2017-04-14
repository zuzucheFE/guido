import Parent from './class';

export default class Child extends Parent {
    constructor() {
        alert('Child constructor');
        super();
    }

    print() {
        alert('Child print');
    }
}
