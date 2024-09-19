import { LightningElement } from 'lwc';

export default class Counter extends LightningElement {

    count = 0
    connectedCallback(){
        console.log("tester")
    }

    increment() {
        this.count += 1

        
    }
    decrement() {
        this.count -= 1
    }
}