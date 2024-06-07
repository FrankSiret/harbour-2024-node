FROM node:21.7-alpine

COPY . .

RUN npm install

CMD ["node", "index.js"]