FROM node:14.15.1-alpine3.12 as client_builder

WORKDIR /usr/src/app

COPY client/package*.json ./

RUN npm install

COPY client .

RUN npm run build


FROM node:14.15.1-alpine3.12 as server_builder

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY server .

RUN npm run build


FROM node:14.15.1-alpine3.12 as server

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm ci --only=production

COPY --from=client_builder /usr/src/app/build client

COPY --from=server_builder /usr/src/app/dist dist

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
