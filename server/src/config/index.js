require('dotenv').config();

const sanitizeRedisUrl = url => url.replace(/^(redis\:\/\/)/, '');

const { REDIS_ENDPOINT_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, PORT } = process.env;

module.exports = {
    redis: {
        endpointUri: REDIS_ENDPOINT_URI
            ? sanitizeRedisUrl(REDIS_ENDPOINT_URI)
            : `${sanitizeRedisUrl(REDIS_HOST)}:${REDIS_PORT}`,
        password: REDIS_PASSWORD || undefined
    },
    app: {
        port: PORT || 3000
    }
};
