class AClass {
    constructor(props) {
        this.propA = props.a;
        this.propB = props.b;
    }

    print() {
        console.log(`${this.propA} and ${this.propB}`);
    }
}


class BClass extends AClass {
    constructor(props) {
        super(props);
    }
}


const objB = new BClass({
    a: 'nameA',
    b: 'nameb',
});
window.objB = objB;
