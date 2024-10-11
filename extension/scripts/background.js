/** Script to run in the background **/

let requestArray = []

const sumNums = (a,b) => {
    console.log(a,b)
    return a+b
}

console.log("this is inside backgroundjs")



chrome.runtime.onMessage.addListener(
    function (request, sendResponse) {
        console.log(request, 'sent request');

        // if (request.type == 'existingRequests') {

        //     chrome.runtime.sendMessage(
        //         { type: "response", requestArray: requestArray },
        //         function (response) {
        //             console.log(response, "response herer, 12");
        //         }
        //     );
        // }
        if (request.time == '1'){
            createAlarm(request);
        }

        if (request.time == '2'){
            requestArray = []
        }

        if(request.time == '3') {
            clearOrgSpecific(request.domain)
        }

        sendResponse;

        // return requestArray

        return true;
        
    }
);

function clearOrgSpecific(orgName) {
    console.log(orgName, 'clear this org name')
}

function addToArray(request) {
    requestArray.push(
        {Id: request.Id, domain: request.domain}
    )
}

function createAlarm(request) {
    // requestArray.push(request)
    addToArray(request)
    chrome.notifications.create(
        request.id + 'set',
        {
            type: "basic",
            iconUrl: "../images/icon-128.png",
            title: "You will be notified once",
            message: "For this deployment Id " + request.id + '\n ' + request.domain,
        },
        function () {}
    );
}



// let queryInterval = setInterval(() => {
//     console.log("inside interval", requestArray)
//     // localStorage.setItem("requestArray", JSON.stringify(requestArray));      
// }, 10000)