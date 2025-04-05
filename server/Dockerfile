#our shared node version
FROM node:20
#specifying the working directory
WORKDIR /app
#copying the package.json file to the container
COPY package*.json ./
#running npm install for node modules
RUN npm install
#copying the current directory to the container
COPY . .
#port
EXPOSE 5001
#command to start the server
CMD ["npm", "run", "dev"]