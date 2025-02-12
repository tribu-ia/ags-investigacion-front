# Etapa de construcción
FROM node:18-buster AS builder
WORKDIR /usr/src/app

# Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm ci 

# Copiar el resto de archivos y construir
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-buster AS production
WORKDIR /usr/src/app

# Copiar archivos necesarios
COPY --from=builder /usr/src/app ./

# Configuración de producción
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Usar next start directamente
CMD ["npm", "run", "start"]