document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.session.get('address', (result) => {
        const addressElement = document.getElementById('address');
        if (result.address) {
            addressElement.textContent = result.address;
        } else {
            addressElement.textContent = 'No address data found';
        }
    });
});

// document.addEventListener('DOMContentLoaded', function () {
//     chrome.storage.session.get('signer', (result) => {
//         const signerElement = document.getElementById('signer');
//         if (result.signer) {
//             signerElement.textContent = result.signer;
//         } else {
//             signerElement.textContent = 'No signer data found';
//         }
//     });
// });
