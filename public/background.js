chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    if (request.type === 'STORE_ADDRESS') {
        chrome.storage.session.set({ address: request.address }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({ status: 'error' });
            } else {
                sendResponse({ status: 'success' });
            }
        });
        return true;
    }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_ADDRESS') {
        chrome.storage.session.get('address', (result) => {
            if (chrome.runtime.lastError) {
                sendResponse({ status: 'error' });
            } else {
                sendResponse({ status: 'success', address: result.address });
            }
        });
        return true; // Indicates that the response will be sent asynchronously
    }
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('Received message:', request);
//     if (request.type === 'STORE_SIGNER') {
//         chrome.storage.session.set({ signer: request.signer }, () => {
//             if (chrome.runtime.lastError) {
//                 sendResponse({ status: 'error' });
//             } else {
//                 sendResponse({ status: 'success' });
//             }
//         });
//         return true;
//     }
// });
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.type === 'GET_SIGNER') {
//         chrome.storage.session.get('signer', (result) => {
//             if (chrome.runtime.lastError) {
//                 sendResponse({ status: 'error' });
//             } else {
//                 sendResponse({ status: 'success', signer: result.signer });
//             }
//         });
//         return true; // Indicates that the response will be sent asynchronously
//     }
// });
