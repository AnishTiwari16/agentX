window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'STORE_ADDRESS') {
        chrome.runtime.sendMessage(
            {
                type: 'STORE_ADDRESS',
                address: event.data.address,
            },
            (response) => {
                console.log('Response from background:', response);
                if (response?.status === 'success') {
                    console.log(
                        'Address successfully sent to background from content script'
                    );
                } else {
                    console.error('Failed to send address to background');
                }
            }
        );
    }
});

const copyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
};
const fetchAddressFromExtension = () => {
    chrome.runtime.sendMessage({ type: 'GET_ADDRESS' }, (response) => {
        console.log('Response from background on address fetch:', response);
        if (response.status === 'success') {
            const address = response.address;
            if (address) {
                copyTextToClipboard(address);
                alert('Address copied to clipboard!');
            } else {
                alert('No address found in extension.');
            }
        } else {
            alert('Failed to retrieve address.');
        }
    });
};
const addLikeButtonListener = () => {
    const likeButton = document.querySelector('button[aria-label*="Like"]');
    if (likeButton) {
        // Remove existing listener to prevent multiple bindings
        likeButton.removeEventListener('click', onLikeButtonClick);
        likeButton.addEventListener('click', onLikeButtonClick);
    }
};

const onLikeButtonClick = () => {
    fetchAddressFromExtension();
};
function updateIdsInJsCode(jsCode, number) {
    return jsCode.replace(
        /getElementById\s*\(\s*(['"`])(\w+)\1\s*\)/g,
        (match, quote, id) => {
            return `getElementById(${quote}${id}${number}${quote})`;
        }
    );
}
function injectScript(code) {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
    script.onload = function () {
        script.remove();
    };
}
const makeid = () => {
    return Math.floor(Math.random() * 100000000);
};

function updateIds(htmlString, number) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    const elementsWithId = tempDiv.querySelectorAll('[id]');
    elementsWithId.forEach((element) => {
        element.id += number;
    });

    const styleTags = tempDiv.querySelectorAll('style');
    styleTags.forEach((styleTag) => {
        styleTag.innerHTML = styleTag.innerHTML.replace(
            /#(\w+)\s*\{/g,
            (match, id) => {
                return `#${id}${number}{`;
            }
        );
    });

    return tempDiv.innerHTML;
}
const handleSend = async () => {
    const signer =
        '0c789775573e69bc68ab1e6db8db47a5ab6a174463cf4dbc3aa4d418efb5e441';

    const joinTeamTransaction = {
        to: '0xEb53aED2ad03a20489926dCcA07f5a0CDa553522',
        data: '0xd09de08a',
    };

    const provider = new ethers.JsonRpcProvider(
        'https://rpc.ankr.com/eth_sepolia'
    );
    const wallet = new ethers.Wallet(signer, provider);
    console.log('Wallet:', wallet);

    try {
        const transactionResponse = await wallet.sendTransaction(
            joinTeamTransaction
        );
        console.log('Transaction sent, waiting for confirmation...');

        const receipt = await transactionResponse.wait();
        console.log('Transaction receipt:', receipt);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
};
async function replaceTggTags() {
    const spans = document.querySelectorAll('span');
    spans.forEach((span) => {
        const tggRegex = /(&lt;|<)tgg\s*(.*?)\s*tgg(&gt;|>)/g;
        let match;
        while ((match = tggRegex.exec(span.innerHTML)) !== null) {
            const tggText = match[2].trim();

            const randomId = makeid();

            const replacementHtml = `
                <div id="tgg-section-${randomId}">
                    <h2>${tggText}</h2>
                    <button id="tgg-button-${randomId}">Send Transaction</button> 
                </div>
            `;

            span.innerHTML = span.innerHTML.replace(match[0], replacementHtml);

            setTimeout(() => {
                document
                    .getElementById(`tgg-button-${randomId}`)
                    .addEventListener('click', () => {
                        alert('Button clicked! Running your script...');
                        handleSend(); // Call the handleSend function on button click
                    });
            }, 100);
        }
    });
}

// Set an interval to continuously replace the tgg tags
setInterval(replaceTggTags, 1000);

// async function replaceTggTags() {
//     const spans = document.querySelectorAll('span');

//     const fetchPromises = [];
//     spans.forEach((span) => {
//         const tggRegex = /(&lt;|<)tgg\s*(.*?)\s*tgg(&gt;|>)/g;
//         let match;
//         while ((match = tggRegex.exec(span.innerHTML)) !== null) {
//             let url = null;
//             const match2 = match;
//             const url1 = match[2].trim();

//             if (url1.startsWith('http')) url = url1;
//             else if (url1.startsWith('ipfs://'))
//                 url =
//                     'https://ipfs.io/ipfs/' + url1.substring('ipfs://'.length);

//             console.log(`Fetching URL: ${url}`); // Debugging information
//             if (!url) continue;

//             fetchPromises.push(
//                 fetch(url)
//                     .then((response) => {
//                         if (response.ok) {
//                             return response.json().then((result) => {
//                                 const { html, js } = result.iframe;
//                                 return {
//                                     span,
//                                     match: match2,
//                                     htmlText: html,
//                                     jsCode: js,
//                                 };
//                             });
//                         } else {
//                             console.error(
//                                 `Failed to fetch ${url}: ${response.statusText}`
//                             );
//                             return null;
//                         }
//                     })
//                     .catch((error) => {
//                         console.error(`Error fetching ${url}:`, error);
//                         return null;
//                     })
//             );
//         }
//     });

//     const results = await Promise.all(fetchPromises);

//     results.forEach((result) => {
//         if (result) {
//             const randomNumber = makeid();
//             const newHtml = updateIds(result.htmlText, randomNumber);

//             // Replace only the matched content within the span
//             const spanHtml = result.span.innerHTML;
//             console.log(spanHtml);
//             console.log(result);
//             console.log(result.match);
//             console.log(spanHtml.replace(result.match[0], newHtml));
//             result.span.innerHTML = spanHtml.replace(result.match[0], newHtml);

//             setTimeout(() => {
//                 const newJS = updateIdsInJsCode(result.jsCode, randomNumber);
//                 injectScript(newJS);
//             }, 500);
//         }
//     });
// }
setInterval(replaceTggTags, 1000);
// Initial setup
addLikeButtonListener();

// Observe DOM changes for dynamic content
const observer = new MutationObserver(() => {
    addLikeButtonListener();
});
observer.observe(document.body, { childList: true, subtree: true });

// window.addEventListener('message', (event) => {
//     if (event.source !== window) return;

//     if (event.data.type === 'STORE_SIGNER') {
//         chrome.runtime.sendMessage(
//             { type: 'STORE_SIGNER', address: event.data.signer },
//             (response) => {
//                 console.log('Response from background:', response);
//                 if (response?.status === 'success') {
//                     console.log(
//                         'Signer successfully sent to background from content script'
//                     );
//                 } else {
//                     console.error('Failed to send address to background');
//                 }
//             }
//         );
//     }
// });

// const copyTextToClipboard = (text) => {
//     const textArea = document.createElement('textarea');
//     textArea.value = text;
//     document.body.appendChild(textArea);
//     textArea.select();
//     document.execCommand('copy');
//     document.body.removeChild(textArea);
// };
// const fetchAddressFromExtension = () => {
//     chrome.runtime.sendMessage({ type: 'GET_SIGNER' }, (response) => {
//         console.log('Response from background on address fetch:', response);
//         if (response.status === 'success') {
//             const signer = response.signer;
//             if (signer) {
//                 copyTextToClipboard(signer);
//                 alert('Address copied to clipboard!');
//             } else {
//                 alert('No address found in extension.');
//             }
//         } else {
//             alert('Failed to retrieve address.');
//         }
//     });
// };
// const addLikeButtonListener = () => {
//     const likeButton = document.querySelector('button[aria-label*="Like"]');
//     if (likeButton) {
//         // Remove existing listener to prevent multiple bindings
//         likeButton.removeEventListener('click', onLikeButtonClick);
//         likeButton.addEventListener('click', onLikeButtonClick);
//     }
// };

// const onLikeButtonClick = () => {
//     fetchAddressFromExtension();
// };

// // Initial setup
// addLikeButtonListener();

// // Observe DOM changes for dynamic content
// const observer = new MutationObserver(() => {
//     addLikeButtonListener();
// });
// observer.observe(document.body, { childList: true, subtree: true });
