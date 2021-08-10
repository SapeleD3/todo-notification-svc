FROM node:14-slim
COPY . /app
WORKDIR /app
COPY package.json .
# Install production dependencies.
RUN npm install
# Copy local codebase into the container image
COPY . .
# Compile down to ES5 with Babel
RUN npm run build
# Start the api server
CMD [ "npm", "start" ]