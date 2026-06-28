# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build args permitem que o Coolify sobrescreva as vars de build se necessário
# Por padrão, o Vite carrega .env.production automaticamente
ARG VITE_API_BASE_URL=https://api.verboplus.com.br/api
ARG VITE_UPLOADS_BASE_URL=https://api.verboplus.com.br
ARG VITE_PORTAL_TENANT_SLUG=mang-guarulhos
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_UPLOADS_BASE_URL=$VITE_UPLOADS_BASE_URL
ENV VITE_PORTAL_TENANT_SLUG=$VITE_PORTAL_TENANT_SLUG

RUN npm run build

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
