const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const redis = require('redis');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

require('dotenv').config();

const app = express();

const redisClient = redis.createClient(
    process.env.REDIS_URL || {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
);

app.use(bodyParser.json());

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

app.listen(process.env.PORT || 3000, () => {
    console.log(`APP is listening on port: ${process.env.PORT || 3000}`);
});
