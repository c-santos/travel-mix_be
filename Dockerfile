# Start with a Node.js base image that uses Node v18

FROM node:18.13-alpine
WORKDIR /travel-mix_be

# Copy the package.json file to the container and install fresh node_modules

COPY package*.json tsconfig*.json /debit-credit/


RUN npm install

# Copy the rest of the application source code to the container

COPY . /travel-mix_be/

# Transpile typescript and bundle the project

# RUN npm run build
# EXPOSE 8001

# Remove the original src directory (our new compiled source is in the `dist` folder)

# RUN rm -r src

# Assign `npm run start:prod` as the default command to run when booting the container

# CMD ["npm", "run", "start:dev"]