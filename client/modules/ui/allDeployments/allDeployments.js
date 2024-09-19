import { LightningElement } from 'lwc';
import { getAllSids } from 'util/session';


export default class AllDeployments extends LightningElement {

    async connectedCallback(){
        getAllSids((cookies) => {
            cookies.forEach(element => {
                console.log(element);
                
            });
        })
        // console.log(resp);


        
    }
}