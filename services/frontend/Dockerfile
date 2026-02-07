FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# En desarrollo, el código se monta vía volúmenes de docker-compose
# Esto permite que Next.js detecte los cambios en tiempo real
COPY . .

EXPOSE 3000

# Por defecto usamos dev para desarrollo local con HMR
CMD ["npm", "run", "dev"]
