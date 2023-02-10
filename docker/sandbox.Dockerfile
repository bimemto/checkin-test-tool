FROM node:16 AS build

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
COPY docker/nginx/default.conf ./

RUN yarn install

COPY . .

RUN yarn gulp

RUN yarn build

### STAGE 2: Run ###
FROM nginx:latest
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY --from=build /usr/src/app/default.conf /etc/nginx/conf.d
EXPOSE 80


