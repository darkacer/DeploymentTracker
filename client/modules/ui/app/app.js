import { LightningElement } from "lwc";
// import { getHostAndSession } from 'util/session';
// import { CurrentPageReference } from 'lightning/navigation';
export default class App extends LightningElement {
    title = "Hello the world";
    cookie;
    currentPageReference;

    value = 'inProgress';

    connectedCallback() {
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

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
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
