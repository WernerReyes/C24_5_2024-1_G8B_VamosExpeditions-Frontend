# Etapa de build
FROM node:18-alpine AS build
WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install

COPY . .

COPY .env.prod .env

RUN pnpm run build
