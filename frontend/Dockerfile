# build stage
FROM node:18 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY --from=build /usr/src/app/dist ./dist
COPY server.js .
EXPOSE 8080
CMD ["node", "server.js"]