# Check out https://hub.docker.com/_/node to select a new base image
FROM node:14-slim

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

# Install the lib's needed for pupeteer
# these are needed for app services runnin as a container
RUN apt-get update \
    && apt-get install -y \
    gconf-service \
    libgbm1 \ 
    libasound2 \ 
    libatk1.0-0 \ 
    libatk-bridge2.0-0 \ 
    libc6 \ 
    libcairo2 \ 
    libcups2 \ 
    libdbus-1-3 \ 
    libexpat1 \ 
    libfontconfig1 \ 
    libgcc1 \ 
    libgconf-2-4 \ 
    libgdk-pixbuf2.0-0 \ 
    libglib2.0-0 \ 
    libgtk-3-0 \ 
    libnspr4 \ 
    libpango-1.0-0 \ 
    libpangocairo-1.0-0 \ 
    libstdc++6 \ 
    libx11-6 \ 
    libx11-xcb1 \ 
    libxcb1 \ 
    libxcomposite1 \ 
    libxcursor1 \ 
    libxdamage1 \ 
    libxext6 \ 
    libxfixes3 \ 
    libxi6 \ 
    libxrandr2 \ 
    libxrender1 \ 
    libxss1 \ 
    libxtst6 \ 
    ca-certificates \ 
    fonts-liberation \ 
    libappindicator1 \ 
    libnss3 \ 
    lsb-release \ 
    xdg-utils \ 
    wget \ 
    && npm i puppeteer

# Copy app source
COPY . .

# Start app and expose running port
CMD [ "npm", "start" ]
EXPOSE 80
