const sendButton = document.querySelector('#test-button');
const resetButton = document.querySelector('#reset-button');
const limitSelect = document.querySelector('#limit-select');
const timerDiv = document.querySelector('#timer');
const resultDiv = document.querySelector('#result');
const pingUrl = '/api/ping';
let resultAmount = 0;

const onSendButtonClick = e => {
    e.preventDefault();

    let counter = 10,
        requestInterval,
        tick = 0,
        requestsSentCount = 0,
        successfullRequests = 0,
        blockedRequests = 0;

    const requestsToSend = parseInt(limitSelect.value);
    const whenToSendTick = Math.ceil(100 / requestsToSend);

    sendButton.disabled = true;
    limitSelect.disabled = true;

    const callPing = async () => {
        try {
            await axios.get(pingUrl, {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0'
                }
            });

            successfullRequests++;
        } catch (err) {
            blockedRequests++;
        }
    };

    timerDiv.innerHTML = `${counter} seconds left`;

    let result = document.createElement('p');

    result.classList.add('lead');
    result.id = `result-${resultAmount}`;

    const sentMessage = document.createElement('span');

    sentMessage.classList.add('sent');

    const successfullMessage = document.createElement('span');

    successfullMessage.classList.add('successfull');
    successfullMessage.style.color = 'green';

    const blockedMessage = document.createElement('span');

    blockedMessage.classList.add('blocked');
    blockedMessage.style.color = 'red';

    result.appendChild(sentMessage);
    result.appendChild(successfullMessage);
    result.appendChild(blockedMessage);

    resultDiv.prepend(result);

    requestInterval = setInterval(async () => {
        if (tick % whenToSendTick === 0) {
            await callPing();

            requestsSentCount++;

            const currentResultsSent = document.querySelector(`#result-${resultAmount} .sent`);

            currentResultsSent.innerHTML = `Sent ${successfullRequests + blockedRequests} requests. `;

            if (successfullRequests) {
                const currentResultsSuccessfull = document.querySelector(`#result-${resultAmount} .successfull`);

                currentResultsSuccessfull.innerHTML = `Handled ${successfullRequests} requests. `;
            }

            if (blockedRequests) {
                const currentResultsBlocked = document.querySelector(`#result-${resultAmount} .blocked`);

                currentResultsBlocked.innerHTML = `${blockedRequests} requests blocked. `;
            }
        }

        if (requestsSentCount === requestsToSend) {
            clearInterval(requestInterval);
        }

        tick++;
    }, 100);

    counterInterval = setInterval(() => {
        counter--;

        if (counter) {
            timerDiv.innerHTML = `${counter} seconds left`;
        }
    }, 1000);

    setTimeout(() => {
        resetButton.classList.remove('d-none');
        sendButton.disabled = false;
        limitSelect.disabled = false;
        timerDiv.innerHTML = '';
        clearInterval(requestInterval);
        clearInterval(counterInterval);

        resultAmount++;
    }, 10 * 1000 + 150);
};

const onResetButtonClick = e => {
    e.preventDefault();

    sendButton.disabled = false;
    resultDiv.innerHTML = '';
    resetButton.classList.add('d-none');
};

document.addEventListener(
    'DOMContentLoaded',
    () => {
        limitSelect.value = 5;
    },
    false
);

sendButton.addEventListener('click', onSendButtonClick);

resetButton.addEventListener('click', onResetButtonClick);
