import { api, LightningElement } from 'lwc';
// import { getAllSids } from 'util/session';


export default class AllDeployments extends LightningElement {

    // listOf

    // @api
    orgName = ''
    // @api
    orgSid = ''
    params = null


    async connectedCallback(){


        console.log('this is the selected org name', this.orgName, '++');
        
        
    }

    @api
    refresh(orgName, sid) {
        console.log('inside child component', orgName, sid);

        this.orgName = orgName
        this.orgSid = sid

        this.params = {domain: this.orgName, session: this.orgSid}

        this.template.querySelector("ui-running-deployment").refresh(this.params);

    }
}