FROM node:current-alpine

LABEL org.opencontainers.image.title="Inventory service" \
      org.opencontainers.image.description="Inventory service rest api to manage inventory" \
      org.opencontainers.image.authors="@anilshirole"

RUN mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install

ENTRYPOINT [ "node", "./src/app.js" ]