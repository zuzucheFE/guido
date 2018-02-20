export default class Parent {
    constructor() {
        alert('Parent constructor');
        this.name = 'kidney';
    }

    say() {
        alert(this.name);
    }
}
