FROM node:18-alpine3.15 AS prod

ARG NODE_ENV=production
ARG PORT=3000
ARG MONGO_CONNECTION_STRING=
ARG SECRET_KEY='j"yjII?Q`?1RfGU'

# environment variables
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV MONGO_CONNECTION_STRING=$MONGO_CONNECTION_STRING
ENV SECRET_KEY=$SECRET_KEY

# create project directory
WORKDIR /usr/src/flip-card-api

# bundle app source
COPY . .

# install dependencies
# enviroment is development because we use babel
RUN NODE_ENV=development npm install
RUN npm run build

EXPOSE $app_port
CMD ["npm", "run", "start"]

#
# Development container
#

FROM node:18-alpine3.15 AS dev
ARG NODE_ENV=development
ARG PORT=3000
ARG MONGO_CONNECTION_STRING=

# environment variables
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV MONGO_CONNECTION_STRING=$MONGO_CONNECTION_STRING

# create project directory
WORKDIR /usr/src/flip-card-api

# bundle app source
COPY . .

# install dependencies
RUN npm install

EXPOSE $app_port
CMD ["npm", "run", "dev"]
