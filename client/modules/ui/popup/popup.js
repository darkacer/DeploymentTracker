import { LightningElement } from 'lwc';
import { getHostAndSession } from 'util/session';

export default class Popup extends LightningElement {

    domain = 'empty'
    session = 'empty'

    get disableButton(){
        return false
    }

    get infoButtonText() {
        return 'Coming Soon...'
    }


    async connectedCallback(){
        // this.data = await this.getData(10)
        this.cookie = await getHostAndSession();
        console.log('This is new', this.cookie)
        this.domain = this.cookie?.domain
        this.session = this.cookie?.session

        // this.columns = columns

        console.table(this.columns);
        
    }
    openDeployments() {
        window.open('https://' + this.domain + '/lightning/setup/DeployStatus/home');
    }

    get showData(){
        return this.domain != 'empty' && this.domain != null && this.domain != undefined
    }

    

    openLink() {
        console.log("this is button click")
        let orgId = 'abcd'

        window.open(chrome.runtime.getURL('popup/index.html?orgid='+orgId));
    }

}