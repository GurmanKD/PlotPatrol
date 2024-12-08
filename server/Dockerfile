FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . /app

ENTRYPOINT [ "node", "app.js" ]
