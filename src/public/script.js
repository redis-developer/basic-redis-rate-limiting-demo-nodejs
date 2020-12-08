const sendButton = document.querySelector('#test-button');
const resetButton = document.querySelector('#reset-button');
const limitSelect = document.querySelector('#limit-select');
const timerDiv = document.querySelector('#timer');
const resultDiv = document.querySelector('#result');
const pingUrl = '/api/ping';
const setLimitUrl = '/api/set-limit';
let responses = {
    successful: 0,
    limited: 0,
    unknown: 0
};
let timeout;

const onLimitSelectChange = async e => {
    try {
        await axios.put(setLimitUrl, { limit: e.target.value });
    } catch (err) {
        console.error(err);
    }
};

const onSendButtonClick = async e => {
    e.preventDefault();

    if (!timeout) {
        let interval;
        let counter = 10;

        limitSelect.disabled = true;

        timeout = setTimeout(() => {
            resetButton.disabled = false;
            sendButton.disabled = true;
            limitSelect.disabled = false;
            clearInterval(interval);
            timerDiv.innerHTML = 'Done, reset your stats';
        }, 10 * 1000);

        timerDiv.innerHTML = `${counter} seconds left`;

        interval = setInterval(() => {
            counter--;
            timerDiv.innerHTML = `${counter} seconds left`;
        }, 1000);
    }

    let results = [];
    let calls = [];

    const callPing = async () => {
        try {
            const response = await axios.get(pingUrl, {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            results.push(response);
        } catch (err) {
            results.push(err.response);
        }
    };

    for (let i = 0; i < 2; i++) {
        calls.push(callPing());
    }

    await Promise.all(calls);

    results.forEach(result => {
        if (!result || !result.status || (result.status !== 200 && result.status !== 429)) {
            responses.unknown++;
        }
        if (result.status === 200) {
            responses.successful++;
        }
        if (result.status === 429) {
            responses.limited++;
        }
    });

    resultDiv.innerHTML = '';

    if (responses.successful) {
        const successfullMessage = document.createElement('h3');

        successfullMessage.style.color = 'green';
        successfullMessage.innerHTML = `${responses.successful} requests were handled properly (status 200)`;
        resultDiv.appendChild(successfullMessage);
    }

    if (responses.limited) {
        const limitedMessage = document.createElement('h3');

        limitedMessage.style.color = 'red';
        limitedMessage.innerHTML = `${responses.limited} requests have been blocked by rate limit (status 429)`;
        resultDiv.appendChild(limitedMessage);
    }

    if (responses.unknown) {
        const unknownMessage = document.createElement('h3');

        unknownMessage.style.color = 'red';
        unknownMessage.innerHTML = `${responses.unknown} requests had server error (different status)`;
        resultDiv.appendChild(unknownMessage);
    }
};

const onResetButtonClick = e => {
    e.preventDefault();
    responses.successful = 0;
    responses.limited = 0;
    responses.unknown = 0;
    sendButton.disabled = false;
    resultDiv.innerHTML = '';
    timeout = null;
};

document.addEventListener(
    'DOMContentLoaded',
    async () => {
        resetButton.disabled = true;
        limitSelect.value = 5;

        try {
            await axios.put(setLimitUrl, { limit: 5 });
        } catch (err) {
            console.error(err);
        }
    },
    false
);

limitSelect.addEventListener('change', onLimitSelectChange);

sendButton.addEventListener('click', onSendButtonClick);

resetButton.addEventListener('click', onResetButtonClick);
