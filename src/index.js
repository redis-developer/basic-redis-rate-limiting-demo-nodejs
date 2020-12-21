const express = require('express');
const path = require('path');
const redis = require('redis');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

require('dotenv').config();

const { REDIS_ENDPOINT_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, PORT } = process.env;

const app = express();

const redisEndpointUri = REDIS_ENDPOINT_URI || `redis://${REDIS_HOST}:${REDIS_PORT}`;

const redisClient = redis.createClient(redisEndpointUri, {
    password: REDIS_PASSWORD
});

const limiter = new RateLimit({
    store: new RedisStore({
        client: redisClient,
        expiry: 10
    }),
    max: 10,
    windowMs: 10 * 1000
});

app.use('/', express.static(path.join(__dirname, './public')));

app.get('/api/ping', limiter, (req, res) => {
    return res.send('PONG');
});

const port = PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
