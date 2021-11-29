FROM node:16.13.0

WORKDIR /app/discord-bot

COPY .env ./
COPY package.json ./
COPY package-lock.json ./
COPY src /app/discord-bot/src

RUN ls -a
RUN npm install

CMD [ "node", "src/index.js" ]