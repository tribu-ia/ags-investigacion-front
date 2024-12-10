# Etapa de construcción
FROM node:18-buster AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-buster AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
EXPOSE 3000
CMD ["npm", "start"]
