FROM node:20

RUN apt-get update && apt-get install -y redis-tools

WORKDIR /server


COPY package*.json ./


RUN yarn install --dev 

COPY . .

RUN yarn global add concurrently nodemon typescript ts-node 

RUN yarn run build

EXPOSE 7000

CMD [ "yarn", "start:dev" ]

