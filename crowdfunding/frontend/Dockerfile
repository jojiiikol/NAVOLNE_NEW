# we will use node:alpine docker image
FROM node:alpine

# set /app as work directory
WORKDIR /usr/src/app

# copy package.json to work directory, so that we install npm dependencies
COPY package.json /usr/src/app

# install npm dependencies
RUN npm install # OR `RUN yarn install`

# copy your project files to work directory
COPY . /usr/src/app

CMD ["npm", "start"]