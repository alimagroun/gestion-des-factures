### STAGE 1: Build ###
FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production  # Use npm ci or npm install --only=production
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/material-pro-angular-lite /usr/share/nginx/html
EXPOSE 80
