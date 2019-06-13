# Version of node
FROM node:10.7.0


# Create app directory
WORKDIR /app


# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./


# Install dependencies
RUN npm install


# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .


# Tell Docker what port to expose for app to run on
EXPOSE 8080


# Set the command to run the node server
CMD npm run serve
