FROM node:10-alpine

RUN mkdir -p /home/node/simplecrawler-app/node_modules \
  && mkdir -p /home/node/simplecrawler-app/client/node_modules \
  && chown -R node:node /home/node/simplecrawler-app

WORKDIR /home/node/simplecrawler-app

COPY package*.json ./

COPY client/package*.json ./client/

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3030

CMD [ "npm", "start" ]
