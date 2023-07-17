FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install prom-client
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]

