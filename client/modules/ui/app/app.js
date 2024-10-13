// import { contains } from "@lwc/synthetic-shadow/dist/env/node";
import { LightningElement, track } from "lwc";
import { getAllSids } from 'util/session';
// import { getHostAndSession } from 'util/session';
// import { CurrentPageReference } from 'lightning/navigation';
export default class App extends LightningElement {
    title = "Hello the world";
    cookie;
    currentPageReference;
    value = 'Placeholder'
    sidValue = ''

    @track
    options = [ 
        { label: 'Placeholder', value: 'Placeholder' },
        // { label: 'In Progress', value: 'inProgress' },
        // { label: 'Finished', value: 'finished' },
    ]

    // value = 'inProgress';

    async connectedCallback() {
        // this.cookie = await getHostAndSession();

        const queryString = window.location.search;
        console.log(queryString);
        const urlParams = new URLSearchParams(queryString);

        const orgId = urlParams.get("orgid");
        console.log(orgId);

        // let orgId = currentPageReference.state?.orgId

        // this.domain += orgId

        if (!("Notification" in window)) {
            console.log("This browser does not support notifications.");
            return;
        }
        Notification.requestPermission().then((result) => {
            console.log(result);
        });


        getAllSids((cookies) => {
            this.options = []
            cookies.forEach(element => {
                
                if(element?.domain.includes('my.salesforce.com')) {
                    console.log('THIS => ', element);
                    this.options.push({label: element.domain, value:element.domain, token: element.value})
                }
                
            });
            this.options = [...this.options]
        })


    }

    sendNotification() {
        // new Notification("To do list", { body: "This is a notification", icon: "../images/icon-128.png" });

        chrome.notifications.create(
            "name-for-notification",
            {
                type: "basic",
                iconUrl: "../images/icon-128.png",
                title: "This is a notification",
                message: "hello there!",
            },
            function () {}
        );
    }

    // get options() {
    //     return [
            
    //     ];
    // }

    handleChange(event) {
        this.value = event.detail.value;

        console.log('inside handle change', JSON.stringify(this.options));
        console.log('searching for', this.value);
        
        

        for(let i = 0; i < this.options.length; i++) {
            console.log(this.options[i].label);
            
            if(this.value == this.options[i].label) {
                console.log('we found this', this.options[i]);
                this.sidValue = this.options[i].token
                break;
            }

        }
        this.template.querySelector("ui-all-deployments").refresh(this.value, this.sidValue);



        // this.orgName = this.value
    }

    get domain() {
        return this.cookie?.domain || "empty";
    }

    get session() {
        return this.cookie?.session || "empty";
    }

    handleClick() {
        console.log("clicked@@!");
        this.sendNotification();
    }
}
