# Etapa de construcción
FROM node:18-buster AS builder

# Argumento para el ambiente (dev, staging, prod)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci 

# Copiar archivos de ambiente correspondientes
COPY .env.* ./
COPY .env ./
COPY . .

# Construir la aplicación según el ambiente
RUN if [ "$NODE_ENV" = "production" ] ; then \
        npm run build:prod ; \
    else \
        npm run build:dev ; \
    fi

# Etapa de producción
FROM node:18-buster AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
EXPOSE 3000

# Iniciar según el ambiente
CMD if [ "$NODE_ENV" = "production" ] ; then \
        npm run start:prod ; \
    else \
        npm run start:dev ; \
    fi
