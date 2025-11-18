# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies (use CI to get a clean install)
COPY package*.json ./
RUN npm ci --silent

# Copy sources and build
COPY . .
RUN npm run build

# Production stage: minimal nginx image serving the generated SPA
FROM nginx:stable-alpine AS production

# Port inside the container (nginx default)
ARG PORT=80
ENV PORT=${PORT}

# Default backend host. Override at runtime with -e BACKEND_HOST=...
# Use host.docker.internal on Docker Desktop (Windows/WSL2/Mac) to reach host services
ENV BACKEND_HOST=host.docker.internal

# Optional runtime env defaults (app reads VUE_APP_* at build time; keep defaults here harmless)
ENV VUE_APP_API_URL=/smash-order
ENV VUE_APP_API_TIMEOUT=30000
ENV VUE_APP_TITLE=SmashOrder

# Copy built assets produced in the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx template for envsubst; official nginx image will process templates
COPY nginx.conf /etc/nginx/templates/nginx.conf.template

# Remove default server config to avoid conflicts (make our template the default)
RUN rm -f /etc/nginx/conf.d/default.conf || true

# Expose the port the container will listen on
EXPOSE 80

# Use the exec form with plain ASCII characters to avoid '/bin/sh: [nginx,: not found'
CMD ["nginx", "-g", "daemon off;"]