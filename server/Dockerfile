FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g npm@latest
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]


# Development stage
#FROM node:22-alpine AS dev

# Define working directory in container
#WORKDIR /app

# Copy package.json and package-lock.json to container
#COPY package*.json ./
#RUN npm install

# Copy all files to container
#COPY .  .

#CMD ["node", "index.js"]


# Production stage
#FROM node:22-alpine AS prod

# Define working directory in container
#WORKDIR /app

# Copy package.json and package-lock.json to container
#COPY package*.json ./
#RUN npm install

# Copy all files to container
#COPY .  .

#EXPOSE 3001
# Start the app in production
#CMD ["node", "index.js"]


# Stage 1: Install dependencies and build
#FROM node:16-alpine AS builder
#WORKDIR /app

# Copy and install dependencies
#COPY package.json ./
#RUN npm install --production

# Copy all application files
#COPY . .


# Expose backend port
#EXPOSE 3001

# Start the backend
#CMD ["node", "index.js"]
