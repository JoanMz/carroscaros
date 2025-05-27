FROM node:12.22-bullseye

WORKDIR /app

COPY ./controllers ./controllers
COPY ./models ./models
COPY ./index.js ./index.js
COPY ./package.json ./package.json

RUN npm i

ENTRYPOINT ["node", "index.js"]
