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

const makeid = () => {
    return Math.floor(Math.random() * 100000000);
};
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
const botHandle = '@YourBotHandle';

// Function to scan tweets and check if the bot is tagged
function checkForTag() {
    const tweets = document.querySelectorAll('article');
    tweets.forEach((tweet) => {
        console.log(tweet);
        const text = tweet.innerText;
        if (text.includes(botHandle)) {
            const tweetId = extractTweetId(tweet); // Function to extract tweet ID
            sendReply('1836379437056553410');
        }
    });
}

// Helper to extract tweet ID from the DOM
function extractTweetId(tweetElement) {
    const url = tweetElement.querySelector('a').getAttribute('href');
    const tweetId = url.split('/').pop();
    console.log(tweetId);
    return tweetId;
}

// Send reply
function sendReply(tweetId) {
    const message = 'Thanks for the mention!';
    chrome.runtime.sendMessage({
        action: 'reply',
        tweetId: tweetId,
        message: message,
    });
}

// Monitor tweets
setInterval(checkForTag, 5000); // Run every 5 seconds

setInterval(replaceTggTags, 1000);
