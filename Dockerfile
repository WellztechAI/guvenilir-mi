# 1. Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Pass build args if you want to bake environment variables into the build,
# OR we rely on a runtime script. Since Vite bakes them at build time,
# we need to provide the .env variables during the build phase.
# To keep this generic, we'll assume the .env.production file is copied over or variables are passed.

RUN npm run build

# 2. Serve stage
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
