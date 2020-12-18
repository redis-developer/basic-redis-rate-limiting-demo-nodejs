# Redis rate-limiting example

![alt text](https://github.com/RemoteCraftsmen/redis-rate-limiting/blob/main/preview.png?raw=true)

## Prerequisites

-   Node - v12.19.0
-   NPM - v6.14.8
-   Docker - v19.03.13 (optional)

## Development

```
git clone https://github.com/RemoteCraftsmen/redis-rate-limiting/

# copy file and set proper data inside
cp .env.example .env

# install dependencies
npm cache clean && npm install

# run docker compose or install redis manually
docker network create global
docker-compose up -d --build

npm run dev

```

## Heroku deployment (1 click install)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
