FROM node:21.7-alpine

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]