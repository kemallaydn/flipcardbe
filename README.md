# flip-card api

Flip-card backend application with node.js, mongoDB

## Clone Project

clone this project using git

```bash
git clone git@github.com:saracalihan/flip-card-api.git
cd flip-card-api
```

## Install dependencies

```bash
npm install
```

## Setup environment

Copy `sample.env` file then change it for yours environmet.

```bash
cp sample.env .env
cp sample.env .env.prod
```

## Start project

### Database and other staff

We define and run stuff like database or cache with **_Docker Compose_**

> Please make sure your environment variables like ports or volumes match the environment variable definitions in `docker-compose.yml`!

**Run all services**:

```bash
docker compose up
# if you dont want to see outputs run this command:
# docker compose up -d
```

### Production

Build code to ES6 then run it.

> Dont forget, code will run with NODE_ENV is "production"

```bash
npm run start:prod
```

### Development

We run project with nodemon for it's hotreloading feature

```bash
npm run start:dev
```

# License

> Not licensed
