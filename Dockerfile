# Etapa de build
FROM node:22.16.0-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Etapa de producción
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
