FROM node:alpine AS build

WORKDIR /usr/src/app

# copy package.json to work directory, so that we install npm dependencies
COPY ../frontend/package.json /usr/src/app
COPY ../frontend/package-lock.json /usr/src/app

# install npm dependencies
RUN npm install # OR `RUN yarn install`

# copy your project files to work directory
COPY ../frontend /usr/src/app

RUN npm run build

FROM nginx:1.27.3-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /usr/src/app/build /usr/share/nginx/html/

