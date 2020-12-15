const sendButton = document.querySelector('#test-button');
const resetButton = document.querySelector('#reset-button');
const limitSelect = document.querySelector('#limit-select');
const timerDiv = document.querySelector('#timer');
const resultDiv = document.querySelector('#result');
const pingUrl = '/api/ping';

const onSendButtonClick = e => {
    e.preventDefault();

    let counter = 10,
        requestInterval,
        counterInterval,
        tick = 1,
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

    const sentMessage = document.createElement('span');
    const successfullMessage = document.createElement('span');
    successfullMessage.style.color = 'green';

    const blockedMessage = document.createElement('span');
    blockedMessage.style.color = 'red';

    result.appendChild(sentMessage);
    result.appendChild(successfullMessage);
    result.appendChild(blockedMessage);

    resultDiv.prepend(result);

    requestInterval = setInterval(async () => {
        if (tick % whenToSendTick === 0) {
            await callPing();

            requestsSentCount++;

            sentMessage.innerHTML = `Sent ${successfullRequests + blockedRequests} requests. `;

            if (successfullRequests) {
                successfullMessage.innerHTML = `Handled ${successfullRequests} requests. `;
            }

            if (blockedRequests) {
                blockedMessage.innerHTML = `${blockedRequests} requests blocked. `;
            }
        }

        if (requestsSentCount === requestsToSend) {
            resetButton.classList.remove('d-none');
            sendButton.disabled = false;
            limitSelect.disabled = false;
            timerDiv.innerHTML = '';
            clearInterval(requestInterval);
            clearInterval(counterInterval);
        }

        tick++;
    }, 100);

    counterInterval = setInterval(() => {
        counter--;

        if (counter) {
            timerDiv.innerHTML = `${counter} seconds left`;
        }
    }, 1000);

    setTimeout(() => {}, 10 * 1000 + 150);
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
