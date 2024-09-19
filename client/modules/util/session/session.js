const myBrowser = typeof chrome === 'undefined' ? browser : chrome;
const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

const getRunningDeployments = async () => {
    const myHeaders = new Headers();
    let details = await getHostAndSession()
    if (!details) {
        return
    }
    myHeaders.append("Authorization", "Bearer " + details.session);
    myHeaders.append("Content-Type", "application/json");
    

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    // console.log('this is domain', await getHostAndSession());


    // console.log('more domain', details.domain);
    
    
    return fetch('https://'+details.domain+"/services/data/v62.0/tooling/query/?q=Select+id,Status,CanceledBy.Name,CreatedBy.Name,NumberComponentErrors,NumberComponentsDeployed,CreatedDate+from+DeployRequest+Where+CreatedDate=Today+Or+CreatedDate=Yesterday+Order+By+CreatedDate+desc+Limit+100", requestOptions)
    .then((response) => response.text())
    .then((result) => result)
    .catch((error) => console.error(error));
}

const getHostAndSession = async () => {
    let tab = await getCurrentTab();
    console.log(tab, '---');
    
    if(!tab.url) {
        return
    }
    let url = new URL(tab.url)?.origin;
    
    let cookieStoreId = await getCurrentTabCookieStoreId(tab.id);
    
    let cookieDetails = {
        name: "sid",
        url: url,
        storeId: cookieStoreId,
    };
    console.log('tab',tab);
    const cookie = await chrome.cookies.get(cookieDetails);
    console.log('cookie',cookie);
    if (!cookie) {
        return;
    }
    
    // try getting all secure cookies from salesforce.com and find the one matching our org id
    // (we may have more than one org open in different tabs or cookies from past orgs/sessions)
    let [orgId] = cookie.value.split("!");
    let secureCookieDetails = {
        name: "sid",
        secure: true,
        storeId: cookieStoreId,
    };
    
    const cookies = await chrome.cookies.getAll(secureCookieDetails);
    console.log(cookies);

    let sessionCookie = cookies.find((c) => c.value.startsWith(orgId + "!"));
    if (!sessionCookie) {
        return;
    }

    console.log(sessionCookie, 'session cookie here');
    

    return {
        domain: sessionCookie.domain,
        session: sessionCookie.value,
    };
}

const getAllSids = (callback) => {
    // chrome.cookies.getAllCookieStores((stores) => {
    //     console.log(stores);
        
    //     // var currentStore = stores.find(obj => {
    //     //     return obj.tabIds.includes(tabId);
    //     // });
    //     // return currentStore.tabIds[tabId];
    // });
    // const getOrgNames = (callback) => {
        // uncomment me later
        if (myBrowser.cookies) {
            myBrowser.cookies.getAll(
                {
                    name: 'sid'
                },
                callback
            );
        }
    // };
    
}


getCurrentTabCookieStoreId = async (tabId) => {
    chrome.cookies.getAllCookieStores((stores) => {
        var currentStore = stores.find(obj => {
            return obj.tabIds.includes(tabId);
        });
        return currentStore.tabIds[tabId];
    });
}

export {getHostAndSession,getCurrentTab, getRunningDeployments, getAllSids};

