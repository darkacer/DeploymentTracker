import { LightningElement, track } from "lwc";
import { getRunningDeployments, getHostAndSession } from "util/session";

const myBrowser = typeof chrome === "undefined" ? browser : chrome;

const columns = [
    { label: "Id", fieldName: "Id", sortable: "true" },
    { label: "Status", fieldName: "Status", sortable: "true" },
    // { label: 'DeployedSuccess', fieldName: 'DeployedSuccess' , sortable: "true"},
    // { label: 'DeployedFailed', fieldName: 'DeployedFailed' , sortable: "true"},
    {
        label: "CreatedDate",
        fieldName: "CreatedDate",
        sortable: "true",
        type: "date",
        typeAttributes: {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        },
    },
    // { label: 'Icon', initialWidth: 34, fieldName: 'Icon', cellAttributes: { iconName: { fieldName: 'dynamicIcon' }, iconAlternativeText: {fieldName: 'iconAltText'} } }
    
    /* removing button from here 
    
    {
        type: "button",
        label: "Notify",
        initialWidth: 80,
        typeAttributes: {
            label: "",
            name: "",
            title: "",
            disabled: { fieldName: "buttonDisabled" },
            value: "",
            iconPosition: "center",
            iconName: { fieldName: "dynamicIcon" },
            variant: "Brand",
        },
    },

    */
];

const sortByStatus = (data, sortOrder) => {
    return data.slice().sort((a, b) => {
        // Get the index of each status in the sortOrder array
        const indexA = sortOrder.indexOf(a.iconAltText);
        const indexB = sortOrder.indexOf(b.iconAltText);

        // Compare the indices to determine the order
        return indexA - indexB;
    });
};

export default class RunningDeployment extends LightningElement {
    @track data;
    @track columns;
    showData = false;
    // property1 = true;
    // property2 = false;
    @track sortBy;
    @track sortDirection = "asc";
    domain = "empty";
    session = "empty";

    @track ogRecords

    async connectedCallback() {
        // this.data = this.getData()
        console.log("this", this.data);
        this.cookie = await getHostAndSession();
        console.log("This is new", this.cookie);
        this.domain = this.cookie?.domain;
        this.session = this.cookie?.session;
        this.columns = columns;

        let responseText = await getRunningDeployments();

        if (!responseText) {
            return;
        }

        let response = JSON.parse(responseText);

        console.log("this is response", response);
        // try {
        //     let backgroundWindow =
        //         await myBrowser.extension.getBackgroundPage();
        //     console.log(
        //         backgroundWindow.getRequestArray(),
        //         "This is request array from backgroud js in popup js"
        //     );
        // } catch (error) {
        //     console.log("errror ", error);
        // }

        if (response?.done && response?.size > 0) {
            console.log("inside");

            this.data = response.records?.map((rec) => {
                // if (rec.Status == "InProgress") {
                //     this.property1 = rec.Id;
                // }

                let iconName = "utility:close";
                let iconText = rec.Status;
                let status =
                    rec.Status == "Canceled" ? rec.CanceledBy.Name : "";
                let buttonDisabled = true;

                switch (rec.Status) {
                    case "InProgress":
                        // iconName = 'action:apex'
                        iconName = "utility:notification";
                        buttonDisabled = false;
                        break;
                    case "Succeeded":
                        iconName = "action:approval";
                        buttonDisabled = true;
                        break;
                    case "Failed":
                        iconName = "action:bug";
                        buttonDisabled = false;
                        break;
                    case "Pending":
                        // iconName = 'action:more'
                        iconName = "utility:notification";
                        buttonDisabled = false;
                        break;
                    default:
                        iconName = "utility:close";
                        buttonDisabled = true;
                }

                return {
                    Id: rec.Id.substring(0, 15),
                    Status: status + " " + rec.Status,
                    DeployedSuccess: "" + rec.NumberComponentsDeployed,
                    DeployedFailed: "" + rec.NumberComponentErrors,
                    dynamicIcon: iconName,
                    CreatedDate: rec.CreatedDate,
                    iconAltText: iconText,
                    buttonDisabled: buttonDisabled,
                };
            });

            this.showData = true;

            const sortOrder = [
                "InProgress",
                "Pending",
                "Failed",
                "Canceled",
                "Succeeded",
            ];
            this.data = sortByStatus(this.data, sortOrder);
            this.ogRecords = this.data

            let existingRequestIds = JSON.parse(localStorage.getItem('requestIds'))?.map(e => e.Id)

            this.data.forEach(e => {
                if(existingRequestIds?.includes(e.Id)){
                    e.buttonDisabled = true
                }
            })


        }

        /**
         * we want to communicate with background js since that script is a service worker responsible to continuously
         * run in the background, so we set the below event listener, so that background.js can send message back here
         * To initiate the response from background.js we use sendMessage from below to first communicate with background.js
         */

       
    }

    
    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();

        // let tempData = []
        let tempData = this.ogRecords;
    
        if (searchKey) {
    
            if (tempData) {
                let searchRecords = [];
    
                for (let record of tempData) {
                    let valuesArray = Object.values(record);
    
                    for (let val of valuesArray) {
                        console.log('val is ' + val);
                        let strVal = String(val);
    
                        if (strVal) {
    
                            if (strVal.toLowerCase().includes(searchKey)) {
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
    
                console.log('Matched Accounts are ' + JSON.stringify(searchRecords));
                tempData = searchRecords;
            }
        }

        this.data = [...tempData]
    }
    

    clearAllNotificationRequestStream(event) {
        localStorage.setItem('requestIds', JSON.stringify([]))
        const recId = event.detail.row?.Id;
        chrome.runtime.sendMessage(
            { time: "2", id: recId, type:'clearNotifications' },
            function (response) {
                console.log(response, "response herer");
                return true
            }
        );
    }

    clearOrgNotificationRequestStream(event) {
        localStorage.setItem('requestIds', JSON.stringify([]))

        chrome.runtime.sendMessage(
            {time:'3', type:'clearOrgNotifications', domainName:this.domain},
            function(response) {
                console.log(this.response, 'after org clearance')
            }
        )
    }

    // updateDataTable(existingRequestIds) {
    //     this.data.forEach((el) => {
    //         console.log(
    //             "in foreach loop",
    //             el.Id,
    //             existingRequestIds.includes(el.Id)
    //         );

    //         if (existingRequestIds.includes(el.Id)) {
    //             el.buttonDisabled = true;
    //         }
    //     });

    //     this.data = [...this.data];
    // }

    callRowAction(event) {
        const recId = event.detail.row?.Id;
        const actionName = event.detail.action?.name;

        console.log("recId", recId, actionName);

        chrome.runtime.sendMessage(
            { time: "1", Id: recId , domain: this.domain},
            function (response) {
                console.log(response, "response herer");
            }
        );

        let existingRequests = JSON.parse(localStorage.getItem('requestIds'))

        console.log(existingRequests, 'existing req')
        existingRequests.push({Id: recId, domain: this.domain})
        localStorage.setItem('requestIds', JSON.stringify(existingRequests))

        this.data.forEach((element) => {
            if (recId == element.Id) {
                element.buttonDisabled = true;
            }
        });
        this.data = [...this.data];
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.data));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === "asc" ? 1 : -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ""; // handling null values
            y = keyValue(y) ? keyValue(y) : "";
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.data = parseData;
    }
}
