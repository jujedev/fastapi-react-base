# ========== BUILD STAGE ==========
FROM node:18 AS build

WORKDIR /app

# Corepack + Yarn
RUN corepack enable
RUN corepack prepare yarn@4.11.0 --activate

# Copiar archivos base
COPY package.json yarn.lock ./

# Instalar dependencias segun Yarn Pnp
RUN yarn install

# Copiar el resto del proyecto
COPY . .

# Crear el build para producción
RUN yarn build

# ========== NGINX STAGE ==========
FROM nginx:alpine

# Copiar build final
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]