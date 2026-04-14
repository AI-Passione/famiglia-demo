# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# The context is the parent directory (..)
# Copy the frontend source from the sibling repo
COPY famiglia-core/src/famiglia_core/command_center/frontend/package*.json ./
RUN npm install

COPY famiglia-core/src/famiglia_core/command_center/frontend/ .

# Inject build arguments for Vite
ARG VITE_BACKEND_BASE
ARG VITE_API_BASE
ENV VITE_BACKEND_BASE=$VITE_BACKEND_BASE
ENV VITE_API_BASE=$VITE_API_BASE

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Add basic Nginx config for SPA routing
RUN printf "server { \n\
    listen 80; \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html index.htm; \n\
        try_files \$uri \$uri/ /index.html; \n\
    } \n\
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
