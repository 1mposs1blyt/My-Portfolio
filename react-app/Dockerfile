# react-app/Dockerfile

# 1. Builder
FROM dockerhub.timeweb.cloud/library/node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .

# Vite подставляет переменные на этапе сборки, поэтому ARG, а не ENV рантайма.
# Пустая строка = запросы идут на свой origin, nginx проксирует их дальше.
ARG VITE_BACKEND_URL=""
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# 2. Runner
FROM dockerhub.timeweb.cloud/library/nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# значение по умолчанию, если BACKEND_ORIGIN не передан
ENV BACKEND_ORIGIN=http://app:3000

EXPOSE 80